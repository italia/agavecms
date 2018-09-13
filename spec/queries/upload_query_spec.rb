require "rails_helper"

RSpec.describe UploadQuery, type: :model do
  subject(:query) { described_class.new(site, params) }
  let(:site) { create(:site) }
  let(:params) { {} }

  it { is_expected.to be_a described_class }

  describe "#scope" do
    let(:result) do
      query.scope
    end

    let(:uploads) do
      result[0]
    end

    let(:total_count) do
      result[1]
    end

    let(:special_upload) do
      create(:upload, site: site, title: "oral Cows", format: "jpg")
    end

    let(:special_upload_2) do
      create(:upload, site: site, title: "Space cows", format: "pdf")
    end

    before do
      special_upload
      special_upload_2
    end

    context "query param" do
      let(:params) do
        {
          filter: {
            query: "cows"
          }
        }
      end

      before do
        create_list(:upload, 50, site: site)
      end

      it "returns only the selected uploads" do
        expect(uploads).to match_array [special_upload, special_upload_2]
      end
    end

    context "page param" do
      before do
        create_list(:upload, 50, site: site)
      end

      context "with no specified limit" do
        it "returns first 30 elements" do
          expect(uploads.size).to eq 30
        end
      end

      context "with a limit value of 10" do
        let(:params) { { page: { limit: 10 } } }

        it "returns first 10 elements" do
          expect(uploads.size).to eq 10
        end
      end
    end

    context "page offset param" do
      before do
        create_list(:upload, 20, title: "Foo", site: site)
        create_list(:upload, 28, title: "Bar", site: site)
      end

      context "with a offset value of 1" do
        let(:params) { { page: { offset: 30 } } }

        it "returns the remaining 20 elements" do
          expect(uploads.size).to eq 20
          expect(uploads.second.title).to eq "Foo"
        end
      end
    end

    context "type param" do
      let(:params) do
        { filter: { type: "image" } }
      end

      it "returns only valid uploads" do
        expect(uploads).to include(special_upload)
        expect(uploads).to_not include(special_upload_2)
      end
    end

    context "with a true value" do
      let(:params) do
        { filter: { query: "cows", type: "image" } }
      end

      before do
        create_list(:upload, 50, site: site)
      end

      it "returns only valid items" do
        expect(uploads).to include(special_upload)
        expect(uploads).to_not include(special_upload_2)
      end
    end

    context "sorting" do
      context "asc" do
        let(:params) do
          { sort: { direction: "asc" } }
        end

        it "sorts uploads" do
          expect(uploads).to eq [special_upload, special_upload_2]
        end
      end

      context "asc" do
        it "sorts uploads" do
          expect(uploads).to eq [special_upload_2, special_upload]
        end
      end
    end
  end
end
