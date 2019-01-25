import React from 'react';
import './App.css';
import PropTypes from 'prop-types';

class Modal extends React.Component {

    render() {
        if (!this.props.modalOpen) {
            return null;
        }

        // The gray background
        const backdropStyle = {
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            padding: 110
        };

        // The modal "window"
        const modalStyle = {
            position: 'relative',
            backgroundColor: '#fff',
            borderRadius: 5,
            maxWidth: 600,
            minHeight: 300,
            margin: '0 auto',
            padding: 20
        };

        return (
            <div className="backdrop" style={backdropStyle}>
                <div id="modal" className="modal" style={modalStyle}>
                    <div className="container">
                        <div className="row">
                            <div id="modal" className="col-10 mx-auto col-md-8 col-lg-6 text-center text-capitalize">
                                <h5>Book Details</h5>
                                <p>{this.props.modalBook.title}</p>
                                {(("imageLinks" in this.props.modalBook)
                                    ?
                                    <div className="book-cover bookmodal" style={{ width: 128, height: 192, backgroundImage: `url(${this.props.modalBook.imageLinks.thumbnail})` }}></div>
                                    :
                                    <div className="book-cover book-cover-notfound bookmodal" style={{ width: 128, height: 192 }}>Book Cover Not Available</div>
                                )}
                                 {(("authors" in this.props.modalBook) && this.props.modalBook.authors.map((author, index) => <p key={index} className="book-authors">{author}</p>))}
                                 <p>Pages: {this.props.modalBook.pageCount}</p>
                                 <p>Published: {this.props.modalBook.publisher}  {this.props.modalBook.publishedDate}</p>
                                 <p>Description</p>
                                 <textarea rows="8" cols="60" readOnly value={this.props.modalBook.description} />
                                 <br></br><button onClick={this.props.closeModal}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};
Modal.propTypes = {
    modalOpen: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    modalBook: PropTypes.any.isRequired
  };
export default Modal;