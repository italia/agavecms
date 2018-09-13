require "rails_helper"

RSpec.describe DuplicateItemType do
  let(:site) do
    create(:site)
  end

  let(:item_type_to_duplicate) do
    create(
      :item_type,
      site: site,
      name: "Article",
      api_key: "article",
      singleton: false,
      sortable: false
    )
  end

  let(:field_to_duplicate) do
    create(
      :field,
      item_type: item_type_to_duplicate,
      label: "Title",
      field_type: "text",
      localized: true,
      appeareance: { type: "plain" },
      hint: ";)",
      api_key: "title",
      position: 1
    )
  end

  let(:new_item_type) do
    described_class.new(site, item_type_to_duplicate).call
  end

  let(:duplicate_of_duplicate) do
    described_class.new(site, new_item_type).call
  end

  let(:duplicate_from_root) do
    described_class.new(site, item_type_to_duplicate).call
  end

  before do
    site
    item_type_to_duplicate
    field_to_duplicate
    item_type_to_duplicate.update_attributes(ordering_field: field_to_duplicate, ordering_direction: "asc")
    new_item_type
    duplicate_of_duplicate
    duplicate_from_root
  end

  describe "#call" do
    it "duplicates item type with ordering field and all of its fields" do
      expect(new_item_type.name).to eq "Article (copy #1)"
      expect(new_item_type.api_key).to eq "article_copy_1"

      expect(new_item_type.singleton).to eq item_type_to_duplicate.singleton
      expect(new_item_type.sortable).to eq item_type_to_duplicate.sortable
      expect(new_item_type.ordering_direction).to eq item_type_to_duplicate.ordering_direction

      expect(new_item_type.ordering_field).to eq new_item_type.fields.first

      expect(new_item_type.fields.first.item_type).to eq new_item_type
      expect(new_item_type.fields.first.label).to eq field_to_duplicate.label
      expect(new_item_type.fields.first.api_key).to eq field_to_duplicate.api_key
      expect(new_item_type.fields.first.field_type).to eq field_to_duplicate.field_type
      expect(new_item_type.fields.first.hint).to eq field_to_duplicate.hint
      expect(new_item_type.fields.first.localized).to eq field_to_duplicate.localized
      expect(new_item_type.fields.first.position).to eq field_to_duplicate.position
      expect(new_item_type.fields.first.appeareance).to eq field_to_duplicate.appeareance
      expect(new_item_type.fields.first.validators).to eq field_to_duplicate.validators
    end

    it "names sequentially item types " do
      expect(duplicate_of_duplicate.name).to eq "Article (copy #2)"
      expect(duplicate_of_duplicate.api_key).to eq "article_copy_2"
    end

    it "names coherently item types with same root" do
      expect(duplicate_from_root.name).to eq "Article (copy #3)"
      expect(duplicate_from_root.api_key).to eq "article_copy_3"
    end
  end

  let(:item_type_to_duplicate2) do
    create(
      :item_type,
      site: site,
      name: "Post",
      api_key: "post",
      singleton: true
    )
  end

  let(:field_to_duplicate2) do
    create(
      :field,
      item_type: item_type_to_duplicate2,
      label: "Title",
      api_key: "title",
      field_type: "text"
    )
  end

  let(:slug_field) do
    create(
      :field,
      item_type: item_type_to_duplicate2,
      label: "Slug",
      field_type: "slug",
      api_key: "slug",
      appeareance: { title_field_id: field_to_duplicate2.id.to_s, url_prefix: nil }
    )
  end

  let(:new_item_type2) do
    described_class.new(site, item_type_to_duplicate2).call
  end

  before do
    site
    item_type_to_duplicate2
    field_to_duplicate2
    slug_field
    new_item_type2
  end

  describe "#call" do
    it "duplicates item type with slug_field" do
      expect(new_item_type2.api_key).to eq "post_copy_1"
      expect(new_item_type2.fields.second.item_type).to eq new_item_type2
      expect(new_item_type2.fields.second.api_key).to eq slug_field.api_key
      expect(new_item_type2.fields.where(api_key: "slug").first.appeareance["title_field_id"]).to eq new_item_type2.fields.where(api_key: "title").first.id.to_s
    end
  end
end
