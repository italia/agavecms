require "spec_helper"

RSpec.describe Agave::Appeareance::String do
  subject(:config) { described_class.new(site, options) }
  let(:site) { instance_double("Site") }
  let(:options) do
    { type: "plain" }
  end

  it "works" do
    subject
  end
end
