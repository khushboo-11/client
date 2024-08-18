import { Modal, Table, message } from 'antd'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../../../redux/loadersSlice';
import moment from 'moment';
import { GetIssues, ReturnBook } from '../../../apiCalls/issues';
import Button from '../../../components/Button';
import IssueForm from './IssueForm';

function Issues({
    open = false,
    setOpen,
    selectedBook,
    reloadBooks
}) {
    const [issues, setIssues] = React.useState([]);
    const [selectedIssue, setSelectedIssue] = React.useState(null);
    const [showIssueForm, setShowIssueForm] = React.useState(false);
    const dispatch = useDispatch();
    const getIssues = async () => {
        try {
            dispatch(ShowLoading());
            const response = await GetIssues({ book: selectedBook._id });
            dispatch(HideLoading());
            if (response.success) {
                setIssues(response.data);
            }
            else {
                message.error(response.message);
            }
        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message);
        }
    }

    useEffect(() => {
        getIssues();
    }, []);

    const onReturnHandler = async (issue) => {
        try {

            //check if book is returned before due date
            const today = moment().format("YYYY-MM-DD");
            const dueDate = moment(issue.returnDate).format("YYYY-MM-DD");
            if (today > dueDate) {
                const fine = moment(today).diff(dueDate, "days") * 1;
                issue.fine = fine;
            }

            issue.returnedDate = new Date();
            issue.book = issue.book._id;
            dispatch(ShowLoading());
            const response = await ReturnBook(issue);
            dispatch(HideLoading());
            if (response.success) {
                message.success(response.message);
                getIssues();
                reloadBooks();
            }
            else {
                message.error(response.message);
            }
        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message);
        }
    };
    const columns = [
        {
            title: "Id",
            dataIndex: "_id",
        },
        {
            title: "Patron/User",
            dataIndex: "user",
            render: (user) => user.name,
        },
        {
            title: "Issued On",
            dataIndex: "issueDate",
            render: (issueDate) => moment(issueDate).format("DD-MM-YYYY hh:mm A"),
        },
        {
            title: "Return Date (Due Date)",
            dataIndex: "returnDate",
            render: (dueDate) => moment(dueDate).format("DD-MM-YYYY hh:mm A"),
        },
        {
            title: "Rent",
            dataIndex: "rent",
        },
        {
            title: "Fine",
            dataIndex: "fine",
        },
        {
            title: "Returned On",
            dataIndex: "returnedDate",
            render: (returnedDate) => {
                if (returnedDate) {
                    return moment(returnedDate).format("DD-MM-YYYY hh:mm A");
                } else {
                    return "Not Returned Yet";
                }
            }
        },
        {
            title: "Action",
            dataIndex: "action",
            render: (action, record) => {
                return (
                    !record.returnedDate && (
                        <div className='flex gap-1'>
                            <Button
                                title="Renew"
                                onClick={() => {
                                    setSelectedIssue(record);
                                    setShowIssueForm(true);
                                }}
                                variant='outlined' />
                            <Button
                                title="Return Now"
                                onClick={() => onReturnHandler(record)}
                                variant='outlined' />

                        </div>
                    )
                );
            }
        }
    ];

    return (
        <Modal
            title=""
            open={open}
            onCancel={() => setOpen(false)}
            footer={null}
            width={1400}
            centered>
            <h1 className='text-xl mt-1 mb-1 text-secondary uppercase font-bold text-center'>
                Issues of {selectedBook.title}
            </h1>
            <Table
                columns={columns}
                dataSource={issues} />

            {showIssueForm && <IssueForm
                selectedBook={selectedBook}
                selectedIssue={selectedIssue}
                open={showIssueForm}
                setOpen={setShowIssueForm}
                setSelectedBook={() => {}}
                getData={()=>{
                    getIssues();
                    reloadBooks();
                }}
                type="edit"
            />}
        </Modal>
    )
}

export default Issues;