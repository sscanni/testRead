import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import ListBooks from './ListBooks'
import { Link } from 'react-router-dom'
import { Route } from 'react-router-dom'
import Modal from './Modal'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import type { BodyScrollOptions } from 'body-scroll-lock';
 
const options: BodyScrollOptions = {
    reserveScrollBarGap: true
}
class BooksApp extends React.Component {
    targetElement = null;
    state = {
        booksReading: [],
        booksWanttoRead: [],
        booksRead: [],
        books: [],
        bookSearchText: "",
        modalBook: [],
        modalOpen: false,
    }

    shelf = {
        currentlyReading: "currentlyReading",
        wantToRead: "wantToRead",
        read: "read",
        none: "none"
    }

    componentDidMount() {
        window.onpopstate  = (e) => {
            this.closeModal()
        }
        this.targetElement = document.querySelector('modal');
        BooksAPI.getAll()
            .then((savedBooks) => {
                this.assignBookShelf(savedBooks)
            })
    }

    assignBookShelf(savedBooks) {
        let arr = savedBooks.filter((item) => {
            return item.shelf === this.shelf.currentlyReading
        })
        this.setState({ booksReading: arr })

        arr = savedBooks.filter((item) => {
            return item.shelf === this.shelf.wantToRead
        })
        this.setState({ booksWanttoRead: arr })

        arr = savedBooks.filter((item) => {
            return item.shelf === this.shelf.read
        })
        this.setState({ booksRead: arr })
    }

    updateBook(book, shelfParm) {
        BooksAPI.update(book, shelfParm)
            .then((resp) => {
            })
    }

    bookSearchChange = event => {
        let searchText = event.target.value;
        this.doSearch(searchText)

    };
    doSearch(searchText) {
        if (searchText.trim()) {
            BooksAPI.search(searchText)
                .then((books) => {
                    if (typeof books === 'object' && "error" in books) {
                        this.setState({ books: [] })
                    } else {
                        this.setState(() => ({ books }))
                    }
                })
        } else {
            this.setState({ books: [] })
        }
        this.setState({ bookSearchText: searchText });
    }

    setSelect = (book) => {
        if (this.state.booksReading.findIndex(item => item.id === book.id) > -1) {
            return this.shelf.currentlyReading;
        }
        if (this.state.booksWanttoRead.findIndex(item => item.id === book.id) > -1) {
            return this.shelf.wantToRead;
        }
        if (this.state.booksRead.findIndex(item => item.id === book.id) > -1) {
            return this.shelf.read;
        }
        return this.shelf.none;
    }

    moveBook = (targetShelf, book) => {
        // Move the book to the taget bookshelf
        if (targetShelf === this.shelf.currentlyReading) {
            if (this.state.booksReading.findIndex(item => item.id === book.id) === -1) {
                this.updateBook(book, targetShelf)
                this.setState(prevState => ({
                    booksReading: [...prevState.booksReading, book]
                }));
            }
        }
        if (targetShelf === this.shelf.wantToRead) {
            if (this.state.booksWanttoRead.findIndex(item => item.id === book.id) === -1) {
                this.updateBook(book, targetShelf)
                this.setState(prevState => ({
                    booksWanttoRead: [...prevState.booksWanttoRead, book]
                }));
            }
        }
        if (targetShelf === this.shelf.read) {
            if (this.state.booksRead.findIndex(item => item.id === book.id) === -1) {
                this.updateBook(book, targetShelf)
                this.setState(prevState => ({
                    booksRead: [...prevState.booksRead, book]
                }));
            }
        }
        if (targetShelf === this.shelf.none) {
            this.updateBook(book, targetShelf)
        }
        // If not the target shelf array then remove the book
        if (targetShelf !== this.shelf.currentlyReading) {
            if (this.state.booksReading.findIndex(item => item.id === book.id) > -1) {
                let newArr = this.state.booksReading.filter((item) => {
                    return item.id !== book.id
                })
                this.setState({ booksReading: newArr });
            }
        }
        if (targetShelf !== this.shelf.wantToRead) {
            if (this.state.booksWanttoRead.findIndex(item => item.id === book.id) > -1) {
                let newArr = this.state.booksWanttoRead.filter((item) => {
                    return item.id !== book.id
                })
                this.setState({ booksWanttoRead: newArr });
            }
        }
        if (targetShelf !== this.shelf.read) {
            if (this.state.booksRead.findIndex(item => item.id === book.id) > -1) {
                let newArr = this.state.booksRead.filter((item) => {
                    return item.id !== book.id
                })
                this.setState({ booksRead: newArr });
            }
        }
    };

    openModal = (book) => {
        this.setState({
          modalOpen: true,
          modalBook: book
        });
        disableBodyScroll(this.targetElement, options);
    };

    closeModal = () => {
        this.setState({
          modalOpen: false
        });
        enableBodyScroll(this.targetElement);
    };

    render() {
        return (
            <div className="app">
                <Route exact path='/' render={() => (
                    <div className="list-books">
                        <div className="list-books-title">
                            <h1>MyReads</h1>
                        </div>
                        <div>
                            <ListBooks shelf={this.shelf.currentlyReading}
                                books={this.state.booksReading}
                                moveBook={this.moveBook}
                                setSelect={this.setSelect}
                                openModal={this.openModal}
                            />
                            <ListBooks shelf={this.shelf.wantToRead}
                                books={this.state.booksWanttoRead}
                                moveBook={this.moveBook}
                                setSelect={this.setSelect}
                                openModal={this.openModal}
                            />
                            <ListBooks shelf={this.shelf.read}
                                books={this.state.booksRead}
                                moveBook={this.moveBook}
                                setSelect={this.setSelect}
                                openModal={this.openModal}
                            />
                            <div className="open-search">
                                <Link to='/search' className="open-search-button">Add a book</Link>
                            </div>
                        </div>
                        <Modal closeModal={this.closeModal} modalOpen={this.state.modalOpen} modalBook={this.state.modalBook} />
                    </div>
                )} />
                <Route path='/search' render={() => (
                    <div className="search-books">
                        <div className="search-books-bar">
                        {/* <Link to='/' className="close-search">Close</Link> */}
                        {((this.state.modalOpen) 
                           ? <Link to='/search' className="close-search">Close</Link> 
                           : <Link to='/' className="close-search">Close</Link>)}
                        <div className="search-books-input-wrapper">
                                {((this.state.modalOpen)
                                    ?
                                    <input type="text" disabled
                                    placeholder="Search by title or author"
                                    value={this.state.bookSearchText}
                                    onChange={this.bookSearchChange} />
                                    :
                                    <input type="text" 
                                    placeholder="Search by title or author"
                                    value={this.state.bookSearchText}
                                    onChange={this.bookSearchChange} />
                                )}
                            </div>
                        </div>
                        <div className="search-books-results">
                            <ListBooks shelf={"search"}
                                books={this.state.books}
                                moveBook={this.moveBook}
                                setSelect={this.setSelect}
                                openModal={this.openModal}
                            />
                        </div>
                        <Modal closeModal={this.closeModal} modalOpen={this.state.modalOpen} modalBook={this.state.modalBook} />
                    </div>
                )} />
            </div>
        )
    }
}

export default BooksApp
