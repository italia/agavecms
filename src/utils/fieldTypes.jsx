import React, { PropTypes } from 'react'

import {
  ImageInput,
  FileInput,
  DateInput,
  DateTimeInput,
  BelongsToInput,
  EnumInput,
  SeoInput,
  MarkdownInput,
  HtmlInput,
  EmbedsManyInput,
  EmbedsOneInput,
  LatLonInput,
  VideoInput,
  SwitchInput,
  TextareaInput,
  InputGroup,
  GalleryInput,
  ColorInput,
} from 'components/form'

import {
  TextAppeareance,
  StringAppeareance,
  SlugAppeareance,
  LinkAppeareance,
  ColorAppeareance,
} from 'components/form/appeareances'

import {
  DateRangeValidator,
  EnumValidator,
  ExtensionValidator,
  FormatValidator,
  NumberRangeValidator,
  SizeValidator,
  FileSizeValidator,
  LengthValidator,
  ItemItemTypeValidator,
  RichTextBlocksValidator,
} from 'components/form/validators'

const validatorsById = {
  required: null,
  unique: null,
  date_range: DateRangeValidator,
  enum: EnumValidator,
  extension: ExtensionValidator,
  format: FormatValidator,
  number_range: NumberRangeValidator,
  size: SizeValidator,
  file_size: FileSizeValidator,
  length: LengthValidator,
  item_item_type: ItemItemTypeValidator,
  items_item_type: ItemItemTypeValidator,
  rich_text_blocks: RichTextBlocksValidator,
}

const fieldTypeValidatorsIds = {
  string: ['required', 'unique', 'length', 'format', 'enum'],
  slug: ['required', 'unique', 'length'],
  text: ['required', 'length', 'format'],
  image: ['required', 'file_size'],
  rich_text: ['rich_text_blocks'],
  links: ['items_item_type', 'size'],
  link: ['item_item_type', 'required'],
  seo: ['required'],
  lat_lon: ['required'],
  date: ['required', 'date_range'],
  date_time: ['required'],
  boolean: [],
  integer: ['required', 'number_range'],
  float: ['required', 'number_range'],
  file: ['required', 'file_size', 'extension'],
  video: ['required'],
  gallery: ['size'],
  color: ['required'],
}

const fieldTypeAppeareances = {
  string: StringAppeareance,
  text: TextAppeareance,
  slug: SlugAppeareance,
  link: LinkAppeareance,
  links: LinkAppeareance,
  color: ColorAppeareance,
}

export const fieldTypes = Object.keys(fieldTypeValidatorsIds)

export function validatorsForFieldType(fieldType) {
  return fieldTypeValidatorsIds[fieldType].reduce((acc, id) => {
    return Object.assign(acc, { [id]: validatorsById[id] })
  }, {})
}

export function appeareanceForFieldType(fieldType) {
  return fieldTypeAppeareances[fieldType]
}

export function inputForFieldType({
  locale,
  fieldName,
  fieldType,
  validators,
  appeareance,
  disabled,
}) {
  switch (fieldType) {
    case 'color':
      return (
        <ColorInput
          disabled={disabled}
          enableAlpha={appeareance.enable_alpha}
          presetColors={appeareance.preset_colors}
        />
      )
    case 'integer':
      return (
        <input
          disabled={disabled}
          type="text"
          autoComplete="off"
        />
      )
    case 'string':
      if (validators.enum) {
        return (
          <EnumInput
            disabled={disabled}
            values={validators.enum.values}
          />
        )
      }

      if (appeareance.type === 'title') {
        return (
          <input
            disabled={disabled}
            type="text"
            className="form__input--large"
            autoComplete="off"
          />
        )
      }

      return (
        <input
          disabled={disabled}
          type="text"
          autoComplete="off"
        />
      )

    case 'slug':
      return (
        <InputGroup
          pre={appeareance.url_prefix || 'https://example.com/'}
          className="input-group--small"
          autoComplete="off"
          disabled={disabled}
        />
      )
    case 'float':
      return <input disabled={disabled} type="text" autoComplete="off" />
    case 'links': {
      const itemTypeIds = validators.items_item_type.item_types
      if (appeareance.type === 'embed') {
        return (
          <EmbedsManyInput
            disabled={disabled}
            id={fieldName}
            itemTypeIds={itemTypeIds}
          />
        )
      }
      return (
        <BelongsToInput
          disabled={disabled}
          multiple id={fieldName}
          itemTypeIds={itemTypeIds}
        />
      )
    }
    case 'link': {
      const itemTypeIds = validators.item_item_type.item_types
      if (appeareance.type === 'embed') {
        return <EmbedsOneInput disabled={disabled} itemTypeIds={itemTypeIds} />
      }
      return <BelongsToInput disabled={disabled} itemTypeIds={itemTypeIds} />
    }
    case 'seo':
      return <SeoInput disabled={disabled} locale={locale} />
    case 'date':
      return <DateInput disabled={disabled} />
    case 'date_time':
      return <DateTimeInput disabled={disabled} />
    case 'image':
      return <ImageInput disabled={disabled} />
    case 'file':
      return <FileInput disabled={disabled} />
    case 'gallery':
      return <GalleryInput id={fieldName} disabled={disabled} />
    case 'text': {
      if (appeareance.type === 'wysiwyg') {
        return <HtmlInput disabled={disabled} />
      }
      if (appeareance.type === 'markdown') {
        return <MarkdownInput disabled={disabled} />
      }
      return <TextareaInput disabled={disabled} />
    }
    case 'boolean':
      return <SwitchInput disabled={disabled} />
    case 'lat_lon':
      return <LatLonInput disabled={disabled} />
    case 'video':
      return <VideoInput disabled={disabled} />
    default:
      return <span>{fieldType}</span>
  }
}

inputForFieldType.propTypes = {
  fieldType: PropTypes.string.isRequired,
  fieldName: PropTypes.string.isRequired,
  validators: PropTypes.object,
  appeareance: PropTypes.object,
  locale: PropTypes.string,
  disabled: PropTypes.bool,
}
