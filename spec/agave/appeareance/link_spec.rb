require "spec_helper"

module Agave
  module Appeareance
    RSpec.describe Agave::Appeareance::Link do
      subject(:config) { described_class.new(site, options) }
      let(:site) { instance_double("Site") }
      let(:options) do
        { type: "select" }
      end

      it "works" do
        subject
      end
    end
  end
end
