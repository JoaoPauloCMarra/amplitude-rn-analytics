import { Campaign, MemoryStorage } from '@amplitude/analytics-core';
import { CampaignTracker } from '../../src/campaign/campaign-tracker';

type TrackerContext = {
  tracker: CampaignTracker;
  storage: MemoryStorage<Campaign>;
  track: jest.Mock<Promise<unknown>, [unknown]>;
  onNewCampaign: jest.Mock<void, [Campaign]>;
};

function createCampaign(overrides?: Partial<Campaign>): Campaign {
  return {
    utm_campaign: 'spring-launch',
    utm_content: undefined,
    utm_id: undefined,
    utm_medium: 'email',
    utm_source: 'newsletter',
    utm_term: undefined,
    referrer: 'https://example.com/post',
    referring_domain: 'example.com',
    dclid: undefined,
    fbclid: undefined,
    gbraid: undefined,
    gclid: undefined,
    ko_click_id: undefined,
    li_fat_id: undefined,
    msclkid: undefined,
    rdt_cid: undefined,
    ttclid: undefined,
    twclid: undefined,
    wbraid: undefined,
    ...overrides,
  };
}

function createTracker(overrides?: {
  disabled?: boolean;
  trackNewCampaigns?: boolean;
  trackPageViews?: boolean;
  excludeReferrers?: string[];
  initialEmptyValue?: string;
}): TrackerContext {
  const storage = new MemoryStorage<Campaign>();
  const track = jest.fn<Promise<unknown>, [unknown]>().mockResolvedValue(undefined);
  const onNewCampaign = jest.fn<void, [Campaign]>();
  const tracker = new CampaignTracker('api-key', {
    storage,
    track,
    onNewCampaign,
    disabled: overrides?.disabled,
    trackNewCampaigns: overrides?.trackNewCampaigns,
    trackPageViews: overrides?.trackPageViews,
    excludeReferrers: overrides?.excludeReferrers,
    initialEmptyValue: overrides?.initialEmptyValue,
  });

  return {
    tracker,
    storage,
    track,
    onNewCampaign,
  };
}

describe('campaign-tracker', () => {
  beforeEach(() => {
    document.title = 'Campaign page';
    window.history.replaceState({}, '', '/debrief?utm_source=newsletter');
  });

  test('should keep default flags and prepend the current hostname to excluded referrers', () => {
    const { tracker } = createTracker({
      excludeReferrers: ['blocked.com'],
    });

    expect(tracker.disabled).toBe(false);
    expect(tracker.trackNewCampaigns).toBe(false);
    expect(tracker.trackPageViews).toBe(false);
    expect(tracker.excludeReferrers[0]).toEqual(window.location.hostname);
    expect(tracker.excludeReferrers).toContain('blocked.com');
    expect(tracker.initialEmptyValue).toEqual('EMPTY');
  });

  test('should detect whether a campaign is new', () => {
    const { tracker } = createTracker({
      excludeReferrers: ['blocked.com'],
    });
    const currentCampaign = createCampaign();

    expect(tracker.isNewCampaign(currentCampaign, undefined)).toBe(true);
    expect(tracker.isNewCampaign(currentCampaign, currentCampaign)).toBe(false);
    expect(
      tracker.isNewCampaign(
        createCampaign({
          utm_campaign: 'summer-launch',
        }),
        currentCampaign,
      ),
    ).toBe(true);
    expect(
      tracker.isNewCampaign(
        createCampaign({
          referring_domain: 'blocked.com',
        }),
        currentCampaign,
      ),
    ).toBe(false);
    expect(
      tracker.isNewCampaign(
        createCampaign({
          referrer: 'https://sub.goodword.com/path',
          referring_domain: 'sub.goodword.com',
        }),
        createCampaign({
          referrer: 'https://api.goodword.com/path',
          referring_domain: 'api.goodword.com',
        }),
        true,
      ),
    ).toBe(false);
    expect(
      tracker.isNewCampaign(
        createCampaign({
          referrer: 'https://api.goodword.com/path',
          referring_domain: 'api.goodword.com',
        }),
        createCampaign({
          referrer: 'https://example.com/path',
          referring_domain: 'example.com',
        }),
        true,
      ),
    ).toBe(true);
  });

  test('should create an identify event and include a page view when enabled', () => {
    const { tracker } = createTracker({
      trackPageViews: true,
      initialEmptyValue: 'missing',
    });

    const event = tracker.createCampaignEvent(
      createCampaign({
        utm_campaign: undefined,
      }),
    );

    expect(event.event_type).toEqual('Page View');
    expect(event.event_properties).toEqual({
      page_title: 'Campaign page',
      page_location: window.location.href,
      page_path: '/debrief',
    });
    expect(event.user_properties).toBeDefined();
    expect(event.user_properties?.$set?.utm_source).toEqual('newsletter');
    expect(event.user_properties?.$unset?.utm_campaign).toEqual('-');
    expect(event.user_properties?.$setOnce?.initial_utm_campaign).toEqual('missing');
  });

  test('should send and persist a campaign for a new session', async () => {
    const { tracker, storage, track, onNewCampaign } = createTracker({
      trackNewCampaigns: true,
    });
    const currentCampaign = createCampaign();
    tracker.parser.parse = jest.fn().mockResolvedValue(currentCampaign);

    await tracker.send(true);

    expect(onNewCampaign).not.toHaveBeenCalled();
    expect(track).toHaveBeenCalledTimes(1);
    expect(await storage.get(tracker.storageKey)).toEqual(currentCampaign);
  });

  test('should skip tracking when disabled or when the campaign is unchanged', async () => {
    const disabledTracker = createTracker({
      disabled: true,
      trackNewCampaigns: true,
    });
    disabledTracker.tracker.parser.parse = jest.fn().mockResolvedValue(createCampaign());

    await disabledTracker.tracker.send(false);

    expect(disabledTracker.track).not.toHaveBeenCalled();

    const unchangedTracker = createTracker({
      trackNewCampaigns: true,
    });
    const currentCampaign = createCampaign();
    unchangedTracker.tracker.parser.parse = jest.fn().mockResolvedValue(currentCampaign);
    await unchangedTracker.storage.set(unchangedTracker.tracker.storageKey, currentCampaign);

    await unchangedTracker.tracker.send(false);

    expect(unchangedTracker.onNewCampaign).not.toHaveBeenCalled();
    expect(unchangedTracker.track).not.toHaveBeenCalled();
  });

  test('should send, persist, and notify when a campaign changes mid-session', async () => {
    const { tracker, storage, track, onNewCampaign } = createTracker({
      trackNewCampaigns: true,
    });
    const previousCampaign = createCampaign();
    const nextCampaign = createCampaign({
      utm_campaign: 'summer-launch',
    });
    tracker.parser.parse = jest.fn().mockResolvedValue(nextCampaign);
    await storage.set(tracker.storageKey, previousCampaign);

    await tracker.send(false);

    expect(onNewCampaign).toHaveBeenCalledWith(nextCampaign);
    expect(track).toHaveBeenCalledTimes(1);
    expect(await storage.get(tracker.storageKey)).toEqual(nextCampaign);
  });
});
