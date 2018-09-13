require "rails_helper"

RSpec.describe UpsertField do
  subject(:command) { described_class.new(field, payload) }

  let(:payload) do
    {
      data: {
        attributes: attributes
      }
    }
  end

  let(:item_type) do
    create(:item_type, site: site)
  end

  let(:site) do
    create(:site, locales: locales)
  end

  let(:locales) { ["it"] }

  let(:add_command) do
    instance_double("ItemMigration::AddField", call: true)
  end

  let(:localize_command) do
    instance_double("ItemMigration::LocalizeField", call: true)
  end

  let(:delocalize_command) do
    instance_double("ItemMigration::DelocalizeField", call: true)
  end

  let(:validate_command) do
    instance_double("ItemMigration::Validate", call: true)
  end

  before do
    allow(ItemMigration::AddField).to receive(:new).with(field) do
      add_command
    end

    allow(ItemMigration::LocalizeField).to receive(:new).with(field) do
      localize_command
    end

    allow(ItemMigration::DelocalizeField).to receive(:new).with(field) do
      delocalize_command
    end

    allow(ItemMigration::Validate).to receive(:new).with(item_type) do
      validate_command
    end
  end

  describe "#call" do
    context "new field" do
      let(:field) do
        build(:field, item_type: item_type)
      end

      before { command.call }

      let(:attributes) do
        {
          api_key: "price",
          field_type: "float",
          validators: {},
          localized: true,
          appeareance: {}
        }
      end

      it "calls AddField" do
        expect(add_command).to have_received(:call)
      end

      it "upserts the field" do
        field.reload
        expect(field.api_key).to eq "price"
        expect(field.validators).to eq({})
        expect(field.appeareance).to eq({})
        expect(field.localized).to be_truthy
      end
    end

    context "already existing field" do
      let(:field) do
        create(
          :field,
          item_type: item_type
        )
      end

      context "if field_type attribute is different" do
        let(:attributes) do
          { field_type: Agave::FieldType::Integer.code }
        end

        it "raises an exception" do
          expect { command.call }.to raise_error(InvalidRecordError)
        end
      end

      context "else" do
        let(:attributes) do
          {
            api_key: "price"
          }
        end

        let(:another_field) do
          create(
            :field,
            item_type: item_type,
            position: another_field_position
          )
        end

        let(:precall) {}

        before do
          precall
        end

        before do
          command.call
        end

        it "does not call AddField" do
          expect(add_command).not_to have_received(:call)
        end

        context "item validations" do
          context "when validations changes" do
            let(:field) do
              create(
                :field,
                item_type: item_type,
                validators: {}
              )
            end

            let(:attributes) do
              {
                validators: { required: {} }
              }
            end

            it "runs validations" do
              expect(validate_command).to have_received(:call)
            end
          end

          context "when localized changes" do
            let(:field) do
              create(
                :field,
                item_type: item_type,
                localized: true
              )
            end

            let(:attributes) do
              { localized: false }
            end

            it "runs validations" do
              expect(validate_command).to have_received(:call)
            end
          end

          context "otherwise" do
            let(:field) do
              create(
                :field,
                item_type: item_type,
                localized: false,
                validators: {}
              )
            end

            let(:attributes) do
              {
                localized: false,
                validators: {}
              }
            end

            it "does't run validations" do
              expect(validate_command).to_not have_received(:call)
            end
          end
        end

        context "change in position" do
          context "move up" do
            let(:precall) do
              another_field
            end

            let(:another_field) do
              create(
                :field,
                item_type: item_type,
                position: 1
              )
            end

            let(:field) do
              create(
                :field,
                item_type: item_type,
                position: 2
              )
            end

            let(:attributes) do
              { position: 1 }
            end

            it "reorders fields" do
              expect(another_field.reload.position).to eq 2
              expect(field.reload.position).to eq 1
            end
          end

          context "move down" do
            let(:precall) do
              another_field
            end

            let(:another_field) do
              create(
                :field,
                item_type: item_type,
                position: 2
              )
            end

            let(:field) do
              create(
                :field,
                item_type: item_type,
                position: 1
              )
            end

            let(:attributes) do
              { position: 2 }
            end

            it "reorders fields" do
              expect(another_field.reload.position).to eq 1
              expect(field.reload.position).to eq 2
            end
          end
        end

        context "localized options" do
          let(:field) do
            create(
              :field,
              item_type: item_type,
              localized: already_localized
            )
          end

          context "from false to true" do
            let(:already_localized) { false }
            let(:attributes) { { localized: true } }

            it "localize field in all items" do
              expect(localize_command).to have_received(:call)
              expect(delocalize_command).not_to have_received(:call)
            end
          end

          context "from true to false" do
            let(:already_localized) { true }
            let(:attributes) { { localized: false } }

            it "delocalize fields in all items" do
              expect(delocalize_command).to have_received(:call)
              expect(localize_command).not_to have_received(:call)
            end
          end

          context "when no changed" do
            [true, false].each do |locale_option|
              let(:already_localized) { locale_option }
              let(:attributes) { { localized: locale_option } }

              it "doesn't anything" do
                expect(delocalize_command).not_to have_received(:call)
                expect(localize_command).not_to have_received(:call)
              end
            end
          end
        end
      end
    end
  end
end
