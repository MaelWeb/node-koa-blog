import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Upload, Button, Input, Icon, message, Switch, Pagination } from 'antd';
import PropTypes from 'prop-types';
import Axios from 'axios';
import {IMG_URL, IMG_QUERY} from '../../../config/';
import './index.less';

const {Header, Content, Footer} = Layout;
const { TextArea } = Input;

export default class BooksManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageUrl: '',
            imageUpUrl: '',
            desc: '',
            href: '',
            title: '',
            author: '',
            allPage: 0,
            allNum: 0,
            page: 1,
            pageSize: 10,
            books: []
        };

    }

    static contextTypes = {
        showMessage: PropTypes.func
    };

    componentWillMount() {
        this.getBooks();
    }

    getBooks(_page) {
        const { pageSize, page } = this.state;
        Axios.get("/api/get/books", {
            params: {
                page: _page || page,
                size: pageSize
            }
        })
        .then( res => {
            this.setState({
                books: res.data.books,
                page: res.data.page,
                allPage: res.data.allPage,
                allNum: res.data.allNum
            })
        })
    }

    uploadereChange = (info) => {
        if (info.file.status === 'done') {
            message.success("上传成功");
            const { response } = info.file;
            this.setState({
                imageUpUrl: `${IMG_URL}${response.data.key}`,
                imageUrl: `${IMG_URL}${response.data.key}`
            });
        }
    }

    imgInputChange = e => {
        this.setState({
            imageUrl: e.target.value
        })
    }

    textChange = e => {
        this.setState({
            desc: e.target.value
        })
    }

    hrefChange = e => {
        this.setState({
            href: e.target.value
        })
    }

    titleChange = e => {
        this.setState({
            title: e.target.value
        })
    }

    authorChange = e => {
        this.setState({
            author: e.target.value
        })
    }

    addBook = e => {
        const { imageUrl, desc, href, title, author } = this.state;

        if (!title ) return message.success("请添加书名");
        if (!author ) return message.success("请添加作者");
        if (!desc ) return message.success("请添加导言");
        if (!imageUrl ) return message.success("请添加封面");


        Axios.post('/api/create/book', {img: imageUrl, desc, href, title, author })
            .then( res => {
                if (res.data.code == 200) {
                    message.success("添加成功");
                    this.getBooks();
                } else {
                    message.error("添加失败")
                }
            })
    }

    bookUploaderChange = (info, index) => {
        if (info.file.status === 'done') {
            message.success("上传成功");
            const { response } = info.file;
            this.setState(preState => {
                preState.books[index].img = `${IMG_URL}${response.data.key}`;

                return { books: preState.books}
            });
        }
    }

    bookImgInputChange = (e, index) => {
        let value = e.target.value;
        this.setState(preState => {
            preState.books[index].img =value;

            return { books: preState.books}
        })
    }

    bookTextChange = (e, index) => {
        let value = e.target.value;
        this.setState(preState => {
            preState.books[index].text = value;

            return { books: preState.books}
        })
    }

    bookHrefChange = (e, index) => {
        let value = e.target.value;
        this.setState(preState => {
            preState.books[index].href = value;

            return { books: preState.books}
        })
    }

    bookTitleChange = (e, index) => {
        let value = e.target.value;
        this.setState(preState => {
            preState.books[index].title = value;

            return { books: preState.books}
        })
    }

    bookAuthorChange = (e, index) => {
        let value = e.target.value;
        this.setState(preState => {
            preState.books[index].author = value;

            return { books: preState.books}
        })
    }

    updateBook = (book) => {
        const { id, ...others } = book;
        Axios.post(`/api/update/book/${id}`, others)
            .then( res => {
                message.success(res.data.message)
            })
    }

    delete = book => {
        let key = book.img.split(IMG_URL)[1];
        this.deleteBookPic(key);
        this.deleteBook(book.id);
    }

    deleteBook(id) {
        Axios
            .delete(`/api/book/${id}`)
            .then( res => {
                message.success(res.data.message)
                if (res.data.code == 200) {
                    this.getBooks();
                }
            });
    }

    deleteBookPic(key) {
        return Axios.post("/api/filedelete", {
            key: key
        })
    }

    changeReadingStatus = (checked, index) => {
        this.setState(preState => {
            preState.books[index].isReading = checked;

            return { books: preState.books}
        })
    }

    changePage = page => {
        this.getBooks(page);
    }

    render() {
        const {imageUrl, imageUpUrl, desc, href, books, title, author, allPage, allNum, page, pageSize} = this.state;
        return (
            <Layout className="books-manage-layout" style={{height: '100%',}}>
                <Header className='books-manage-header clearfix' >
                    <h3>图书管理</h3>
                </Header>
                <Content className="books-manage-content">
                 { books.length ? books.map( (book, index) => <div className="book-box" key={book.id} >
                    <div className="books-wrap">
                        <div className="book-img">
                            { book.img ? <img src={book.img} alt=""/> : <Icon type="picture" />}
                            <Switch checkedChildren="在读" unCheckedChildren="读完" defaultChecked={ book.isReading } onChange={ checked => { this.changeReadingStatus(checked, index) } } />
                        </div>
                        <div className="book-info">
                            <label htmlFor="">
                                <Input className="title" placeholder="书名" value={book.title} onChange={ e => { this.bookTitleChange(e, index) } } />
                            </label>
                            <label htmlFor="">
                                <Input className="author" placeholder="作者" value={book.author} onChange={ e => { this.bookAuthorChange(e, index) } } />
                            </label>
                             <label htmlFor="">
                                <TextArea className="info" placeholder="导言" row="4" value={book.desc} onChange={ e => { this.bookTextChange(e, index) } } />
                            </label>
                            <label htmlFor="">
                                <Input placeholder="试读链接" value={book.href} onChange={ e => { this.bookHrefChange(e, index) } }/>
                            </label>
                            <label htmlFor="">
                                <Input placeholder="请输入封面地址或手动上传" value={book.img} onChange={ e => { this.bookImgInputChange(e, index) } } />
                                <Upload
                                    className='uploader'
                                    accept = "image/*"
                                    action = "/api/fileupload"
                                    data = { { prefix: 'book/' } }
                                    showUploadList={ false }
                                    onChange = { (info) => { this.bookUploaderChange(info, index) } }>
                                    <Button>
                                      <Icon type="upload" />点击上传
                                    </Button>
                                </Upload>
                            </label>
                             <div className="btn">
                                <Button onClick={ () => { this.updateBook(book) } } >保存</Button>
                                <Button onClick={ () => { this.delete(book) } } >删除</Button>
                            </div>
                        </div>
                     </div></div>) : null }
                    <div className="book-box add-box"><div className="books-wrap">
                        <div className="book-img">
                            { imageUrl ? <img src={imageUrl} alt=""/> : <Icon type="picture" />}
                        </div>
                        <div className="book-info">
                            <label htmlFor="">
                                <Input className="title" placeholder="书名" value={title} onChange={ this.titleChange } />
                            </label>
                            <label htmlFor="">
                                <Input className="author" placeholder="作者" value={author} onChange={ this.authorChange } />
                            </label>
                             <label htmlFor="">
                                <TextArea className="info" placeholder="导言" value={desc} onChange={ this.textChange } autosize={{ minRows: 2, maxRows: 6 }} />
                            </label>
                            <label htmlFor="">
                                <Input placeholder="请输入封面地址或手动上传" value={imageUrl} onChange={ this.imgInputChange } />
                                <Upload
                                    className='uploader'
                                    accept = "image/*"
                                    action = "/api/fileupload"
                                    data = { { prefix: 'books/' } }
                                    showUploadList={ false }
                                    onChange = { this.uploadereChange } >
                                    <Button>
                                      <Icon type="upload" />点击上传
                                    </Button>
                                </Upload>
                            </label>
                            <label htmlFor="">
                                <Input placeholder="试读链接" value={href} onChange={ this.hrefChange } />
                            </label>
                            <div className="btn">
                                <Button onClick={ this.addBook } >添加</Button>
                            </div>
                        </div>
                    </div></div>
                </Content>
                { (allPage > 1) ? <Footer><Pagination className='tc' showQuickJumper current={ page }  total={allNum} onChange={ this.changePage } pageSize={pageSize} /></Footer> : null}
            </Layout>
        )
    }
}