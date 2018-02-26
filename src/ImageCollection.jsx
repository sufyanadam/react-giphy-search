import React, { Component } from 'react';

class ImageCollection extends Component {
  render() {
    const style = {
      width: 200,
      margin: '20px 20px 0'
    }

    return (
      this.props.images.map((image, index) => {
        return <div style={style} key={index}><img src={image} alt=""/></div>;
      })
    );
  }
}

export default ImageCollection;
