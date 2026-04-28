require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name = "amplitude-react-native"
  s.version = package["version"]
  s.summary = package["description"]
  s.homepage = package["homepage"]
  s.license = package["license"]
  s.authors = package["author"]

  s.swift_version = "5.0"

  s.platforms = { :ios => "13.4", :tvos => "13.0" }
  s.source = { :git => "https://github.com/JoaoPauloCMarra/amplitude-rn-analytics.git", :tag => "analytics-react-native-v#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm,swift}"

  s.dependency "React-Core"
end
