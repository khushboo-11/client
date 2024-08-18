import React, { useCallback, useEffect } from 'react'
import { HideLoading, ShowLoading } from '../../redux/loadersSlice';
import { useDispatch } from 'react-redux';
import { GetAllBooks } from '../../apiCalls/books';
import { Col, Row, message, Badge } from 'antd';
import { useNavigate } from 'react-router-dom';

function Home() {
  const dispatch = useDispatch();
  const [books, setBooks] = React.useState([]);
  const navigate = useNavigate();
  const getBooks = useCallback(async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetAllBooks();
      dispatch(HideLoading());
      if (response.success) {
        setBooks(response.data);
      }
      else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  });

  useEffect(() => {
    getBooks();
  }, []);

  return (
    <div className='mt-2'>
      <Row
        gutter={[16, 16]}>
        {books.map((book) => {
          return <Col
            xs={24}
            sm={24}
            md={12}
            lg={6}
            xl={6}
            key={book._id}
            onClick={() => navigate(`/book/${book._id}`)}>
            <Badge.Ribbon
              text={book.availableCopies > 0 ? "Available" : "Not Available"}
              color={book.availableCopies > 0 ? "green" : "red"}>
              <div className='rounded bg-white p-2 shadow flex-col gap-1 '>
                <img src={book.image} height='350px' />
                <h1 className='text-md text-secondary uppercase font-bold mt-2 '>
                  {book.title}
                </h1>
              </div>
            </Badge.Ribbon>

          </Col>
        })}
      </Row>
    </div>
  )

}

export default Home