import React, { Component } from 'react';

class PaginationControls extends Component {
  render() {
    if (!this.props.visible) return '';

    const style = {
      paginationControls: {
        display: 'flex',
        width: 300,
        margin: '20px auto'
      },
      paginationControl: {
        width: 20,
        margin: '0 10px'
      },
      paginationInfo: {
        width: 140
      }
    }

    return(
      <div style={style.paginationControls}>
        {
          this.props.currentPage > 1 ?
          <button style={style.paginationControl} onClick={this.props.onPreviousPageClicked}>{"<"}</button>
          :
          <div style={style.paginationControl}></div>
        }
        <div style={style.paginationInfo}>Page {this.props.currentPage} of {this.props.pageCount}</div>
        {
          this.props.currentPage < this.props.pageCount ?
          <button style={style.paginationControl} onClick={this.props.onNextPageClicked}>{">"}</button>
          :
          <div style={style.paginationControl}></div>
        }
      </div>
    );
  }
}

export default PaginationControls;
