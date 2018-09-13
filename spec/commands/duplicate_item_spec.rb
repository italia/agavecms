require "rails_helper"

RSpec.describe DuplicateItem do
  let(:item) do
    create(
      :item,
      item_type: item_type,
      data: {
        unique_string_field.id.to_s => "Title",
        slug_field.id.to_s => "title",
        subtitle_field.id.to_s => "Subtitle",
        author_field.id.to_s => author.id.to_s,
        reviewers_field.id.to_s => [author.id.to_s],
        metas_field.id.to_s => [meta.id.to_s],
        rich_text_field.id.to_s => [block.id.to_s],
      }
    )
  end

  let(:item_type) do
    create(
      :item_type,
      name: "Article",
      api_key: "article",
    )
  end

  let(:site) do
    item_type.site
  end

  let(:unique_string_field) do
    create(
      :field,
      item_type: item_type,
      label: "Title",
      api_key: "title",
      field_type: "string",
      position: 0,
      appeareance: { type: "title" },
      validators: { unique: {} }
    )
  end

  let(:slug_field) do
    create(
      :field,
      item_type: item_type,
      label: "Slug",
      api_key: "slug",
      field_type: "slug",
      position: 1,
      appeareance: {
        title_field_id: unique_string_field.id.to_s,
        url_prefix: nil
      },
      validators: { unique: {} }
    )
  end

  let(:subtitle_field) do
    create(
      :field,
      item_type: item_type,
      label: "Subtitle",
      api_key: "subtitle",
      field_type: "string",
      position: 2,
      appeareance: { type: "plain" },
      validators: { required: {} }
    )
  end

  let(:author_field) do
    create(
      :field,
      item_type: item_type,
      label: "Author",
      api_key: "author",
      field_type: "link",
      position: 3,
      validators: {
        item_item_type: {
          item_types: [author_item_type.id.to_s]
        }
      },
      appeareance: { type: "select" }
    )
  end

  let(:author_item_type) do
    create(
      :item_type,
      site: site,
      name: "Author",
      api_key: "author",
    )
  end

  let(:reviewers_field) do
    create(
      :field,
      item_type: item_type,
      label: "Reviewers",
      api_key: "reviewers",
      field_type: "links",
      position: 4,
      validators: {
        items_item_type: {
          item_types: [author_item_type.id.to_s]
        }
      },
      appeareance: { type: "select" }
    )
  end

  let(:author) do
    create(
      :item,
      item_type: author_item_type,
      data: {}
    )
  end

  let(:metas_field) do
    create(
      :field,
      item_type: item_type,
      label: "Metas",
      api_key: "metas",
      field_type: "links",
      position: 5,
      validators: {
        items_item_type: {
          item_types: [meta_item_type.id.to_s]
        }
      },
      appeareance: { type: "embed" }
    )
  end

  let(:meta_item_type) do
    create(
      :item_type,
      site: site,
      name: "Meta",
      api_key: "meta_info",
    )
  end

  let(:meta_title_field) do
    create(
      :field,
      item_type: meta_item_type,
      label: "Title",
      api_key: "title",
      field_type: "string",
      position: 0,
      appeareance: { type: "title" },
      validators: { required: {} }
    )
  end

  let(:meta) do
    create(
      :item,
      item_type: meta_item_type,
      data: {
        meta_title_field.id.to_s => "Meta title"
      }
    )
  end

  let(:rich_text_field) do
    create(
      :field,
      item_type: item_type,
      label: "Content",
      api_key: "content",
      field_type: "rich_text",
      position: 6,
      validators: {
        rich_text_blocks: {
          item_types: [block_item_type.id.to_s]
        }
      },
      appeareance: {}
    )
  end

  let(:block_item_type) do
    create(
      :item_type,
      site: site,
      name: "Content block",
      api_key: "block",
    )
  end

  let(:block_title_field) do
    create(
      :field,
      item_type: block_item_type,
      label: "Title",
      api_key: "title",
      field_type: "string",
      position: 0,
      appeareance: { type: "title" },
      validators: { required: {} }
    )
  end

  let(:block) do
    create(
      :item,
      item_type: block_item_type,
      data: {
        block_title_field.id.to_s => "Block title"
      }
    )
  end

  let(:new_item) do
    described_class.new(item, true).call
  end

  before do
    item
  end

  describe "#call" do
    it "works" do
      expect(new_item.id).not_to eq(item.id)
      expect(new_item.is_valid).to be_falsy
      expect(new_item.data[unique_string_field.id.to_s]).to eq "Title (duplicate)"
      expect(new_item.data[author_field.id.to_s]).to eq item.data[author_field.id.to_s]
      expect(new_item.data[reviewers_field.id.to_s]).to eq item.data[reviewers_field.id.to_s]
      expect(new_item.data[metas_field.id.to_s]).not_to eq item.data[metas_field.id.to_s]

      new_meta_item = Item.find(new_item.data[metas_field.id.to_s].first)
      expect(new_meta_item.data[meta_title_field.id.to_s]).to eq "Meta title"

      expect(new_item.data[rich_text_field.id.to_s]).not_to eq item.data[rich_text_field.id.to_s]
    end
  end
end
