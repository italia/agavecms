import React, { PropTypes } from 'react'
import {
  DragSource as dragSource,
  DropTarget as dropTarget,
} from 'react-dnd'
import Component from 'components/BaseComponent'
import { handleVerticalHover } from 'utils/hover'

class FieldRow extends Component {
  handleEdit(e) {
    e.preventDefault()

    this.props.onEdit()
  }

  handleDestroy(e) {
    e.preventDefault()
    e.stopPropagation()

    this.props.onDestroy()
  }

  render() {
    const {
      field,
      connectDragPreview,
      connectDropTarget,
      connectDragSource,
      isDragging,
    } = this.props

    const className = ['FieldRow']

    if (isDragging) {
      className.push('is-dragging')
    }

    return connectDragPreview(connectDropTarget(
      <div className={className.join(' ')}>
        {
          connectDragSource(
            <div className="FieldRow__handle">
              <i className="icon--hamburger" />
            </div>
          )
        }
        <div className="FieldRow__info">
          <div>
            <span className="FieldRow__label">
              {field.attributes.label}
              {field.attributes.validators.required && '*' }
            </span>
            <span className="FieldRow__item-type">
              &nbsp;&nbsp;—&nbsp;&nbsp;{this.t(`fieldType.${field.attributes.field_type}`)}
            </span>
          </div>
          <span className="FieldRow__api">
            {field.attributes.api_key}
          </span>
        </div>

        <div className="FieldRow__actions">
          <a
            href="#"
            onClick={this.handleEdit.bind(this)}
            className="button button--micro"
          >
            {this.t('fieldRow.edit')}
          </a>
          <a
            href="#"
            onClick={this.handleDestroy.bind(this)}
            className="button button--micro button--alert"
          >
            {this.t('fieldRow.remove')}
          </a>
        </div>
      </div>
    ))
  }
}

FieldRow.propTypes = {
  field: PropTypes.object.isRequired,
  locales: PropTypes.array.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  onDrag: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  onDropCancel: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDestroy: PropTypes.func.isRequired,
}

const applyDragSource = dragSource(
  'FieldRow',
  {
    beginDrag(props) {
      return {
        index: props.index,
      }
    },
    endDrag(props) {
      props.onDrop(props.field)
    },
  },
  (connect, monitor) => {
    return {
      connectDragSource: connect.dragSource(),
      connectDragPreview: connect.dragPreview(),
      isDragging: monitor.isDragging(),
    }
  }
)

const applyDropTarget = dropTarget(
  'FieldRow',
  {
    hover(props, monitor, component) {
      handleVerticalHover(props, monitor, component)
    },
  },
  (connect) => {
    return {
      connectDropTarget: connect.dropTarget(),
    }
  }
)

export default applyDragSource(applyDropTarget(FieldRow))
