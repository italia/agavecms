require "rails_helper"

RSpec.describe SabayonMiddleware do
  let(:app) { ->(env) { [200, env, "app"] } }
  subject(:middleware) { described_class.new(app) }

  context "when reaching acme-challenge paths" do
    context "ACME_TOKEN and ACME_KEY are set" do
      before do
        ENV["ACME_TOKEN"] = "XXX"
        ENV["ACME_KEY"] = "YYY"
      end

      let(:env) do
        Rack::MockRequest.env_for("http://site.com/.well-known/acme-challenge/XXX")
      end

      before(:each) do
        @code, @env, @body = middleware.call env
      end

      it "returns the acme key" do
        expect(@code).to eq 200
        expect(@env["Content-Type"]).to eq "text/plain"
        expect(@body.first).to eq "YYY"
      end
    end

    context "ACME_TOKEN_X and ACME_KEY_X are set" do
      before do
        ENV["ACME_TOKEN_10"] = "XXX"
        ENV["ACME_KEY_10"] = "YYY"
      end

      let(:env) do
        Rack::MockRequest.env_for("http://site.com/.well-known/acme-challenge/XXX")
      end

      before(:each) do
        @code, @env, @body = middleware.call env
      end

      it "returns the acme key" do
        expect(@code).to eq 200
        expect(@env["Content-Type"]).to eq "text/plain"
        expect(@body.first).to eq "YYY"
      end
    end
  end
end
