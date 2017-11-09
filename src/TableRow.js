import React from 'react';
import PropTypes from 'prop-types';

import getEventHandlerProps from './utils/getEventHandlerProps';
import TableCell from './TableCell';


// TODO possibly convert this to a function like react-virtualized-table
class TableRow extends React.Component {
  constructor() {
    super();

    // <number: columnIndex, Element: <TableCell />>
    this._cellCache = {};
  }

  componentWillMount() {
    this._constructCells(this.props);
  }

  componentWillUpdate(nextProps) {
    // consider checking if each cell should update
    this._cellCache = {};
    this._constructCells(nextProps);
  }

  _constructCells(props) {
    const {
      columns,
      rowIndex,
      rowProps,
    } = props;

    // TODO optimize so we only render cells that are in view
    columns.forEach((column, columnIndex) => {
      const {
        align,
        cellRenderer,
        columnClassName,
        flexStyle,
        onCellClick,
        onCellDoubleClick,
        onCellMouseOut,
        onCellMouseOver,
        onCellRightClick,
      } = column;

      const className = 
        typeof columnClassName === 'function' ?
          columnClassName({ rowProps, columnIndex, rowIndex }) :
          columnClassName;

      const cellContent =
        typeof cellRenderer === 'function' ?
          cellRenderer({ rowProps, columnIndex, rowIndex }) :
          cellRenderer;

      this._cellCache[columnIndex] = (
        <TableCell
          key={`table_cell_${rowIndex}_${columnIndex}`}
          align={align}
          className={className}
          columnIndex={columnIndex}
          flexStyle={flexStyle}
          onClick={onCellClick}
          onDoubleClick={onCellDoubleClick}
          onMouseOut={onCellMouseOut}
          onMouseOver={onCellMouseOver}
          onRightClick={onCellRightClick}
          rowIndex={rowIndex}
        >
          {cellContent}
        </TableCell>
      );
    });
  }

  render() {
    console.log('TableRow.render');

    const {
      rowIndex,
    } = this.props;

    return (
      <div
        className={`Tangelo__Table__row ${this.props.className}`}
        {...getEventHandlerProps(this, { rowIndex })}
      >
        {Object.values(this._cellCache)}
      </div>
    );
  }
};

TableRow.propTypes = {
  /**
   *
   */
  className: PropTypes.string,

  /**
   *
   */
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      align: PropTypes.oneOf([
        'left',
        'right',
        'center',
      ]),
      columnClassName: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
      ]),
      cellRenderer: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.func,
      ]),
      flexStyle: PropTypes.oneOfType([
        PropTypes.shape({
          flexBasis: PropTypes.string,
        }),
        PropTypes.shape({
          flex: PropTypes.string,
        }),
      ]).isRequired,
    })
  ).isRequired,

  /**
   *
   */
  onClick: PropTypes.func,

  /**
   *
   */
  onDoubleClick: PropTypes.func,

  /**
   *
   */
  onMouseOut: PropTypes.func,

  /**
   *
   */
  onMouseOver: PropTypes.func,

  /**
   *
   */
  onRightClick: PropTypes.func,

  /**
   *
   * TODO better proptype validation
   */
  rowProps: PropTypes.object.isRequired,

  /**
   *
   */
  rowIndex: PropTypes.number.isRequired,

  /**
   *
   */
  selected: PropTypes.bool,
};

TableRow.defaultProps = {
  className: '',
  onClick: null,
  onDoubleClick: null,
  onMouseOut: null,
  onMouseOver: null,
  onRightClick: null,
  selected: false,
};

TableRow.displayName = 'TangeloTableRow';


export default TableRow;