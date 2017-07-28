import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Lightbox from 'react-images';
import { PostThumbImage } from '/imports/ui/helpers/post';

export default class Gallery extends Component {
  static propTypes = {
    images: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
    this.setImages();
    this.openLightbox = this.openLightbox.bind(this);
    this.closeLightbox = this.closeLightbox.bind(this);
    this.gotoNext = this.gotoNext.bind(this);
    this.gotoPrevious = this.gotoPrevious.bind(this);
  }

  state = {
    lightboxIsOpen: false,
    currentImage: 0
  };

  componentWillReceiveProps() {
    this.setImages();
  }

  setImages() {
    const { images } = this.props;
    this.formattedImages = images.map((img) => {
      return { src: PostThumbImage(img.url), caption: img.title };
    });
  }

  openLightbox(key) {
    this.setState({
      lightboxIsOpen: true,
      currentImage: key
    });
  }

  closeLightbox() {
    this.setState({
      lightboxIsOpen: false
    });
  }

  gotoPrevious() {
    this.setState({
      currentImage: this.state.currentImage - 1
    });
  }

  gotoNext() {
    this.setState({
      currentImage: this.state.currentImage + 1
    });
  }

  render() {
    const { images } = this.props;
    const { lightboxIsOpen, currentImage } = this.state;
    return (
      <div className="row gallery">
        {images.map((img, key) =>
          <div className="col-sm-12 col-md-6" key={img.url}>
            <img src={PostThumbImage(img.url)} alt={img.title} className="img-responsive" onClick={() => { this.openLightbox(key); }} />
          </div>
        )}
        <Lightbox
          images={this.formattedImages}
          currentImage={currentImage}
          isOpen={lightboxIsOpen}
          onClickPrev={this.gotoPrevious}
          onClickNext={this.gotoNext}
          onClose={this.closeLightbox}
        />
      </div>
    );
  }
}
