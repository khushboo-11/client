import { Modal, Form, message } from 'antd'
import Button from '../../../components/Button'
import React, { useEffect } from 'react'
import { useState } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { GetUserById } from '../../../apiCalls/users';
import { HideLoading, ShowLoading } from '../../../redux/loadersSlice';
import { EditIssue, IssueBook } from '../../../apiCalls/issues';

function IssueForm({
    open = false,
    setOpen,
    selectedBook,
    setSelectedBook,
    getData,
    selectedIssue,
    type
}) {
    const { user } = useSelector(state => state.users);
    const [validated, setValidated] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [patronId, setPatronId] = React.useState(type === "edit" ? selectedIssue.user._id : "");
    const [patronData, setPatronData] = useState(null);
    const [returnDate, setReturnDate] = React.useState(type === "edit" ? moment(selectedIssue.returnDate).format("YYYY-MM-DD") : "");
    const dispatch = useDispatch();

    const validate = async () => {
        try {
            dispatch(ShowLoading());
            const response = await GetUserById(patronId);
            dispatch(HideLoading());
            if (response.success) {
                if (response.data.role !== "patron") {
                    setValidated(false);
                    setErrorMessage("This user is not a patron");
                }
                else {
                    setPatronData(response.data);
                    setValidated(true);
                    setErrorMessage("");
                }

            } else {
                setValidated(false);
                setErrorMessage(response.message);
            }
        } catch (error) {
            dispatch(HideLoading());
            setValidated(false);
            setErrorMessage(error.message);
        }
    };

    const onIssue = async () => {
        try {
            dispatch(ShowLoading());
            let response = null;
            if (type !== "edit") {
                response = await IssueBook({
                    book: selectedBook._id,
                    user: patronData._id,
                    issueDate: new Date(),
                    returnDate,
                    rent: moment(returnDate).diff(moment(), 'days') * selectedBook.rentPerDay,
                    fine: 0,
                    issuedBy: user._id,
                });
            } else {
                response = await EditIssue({
                    _id: selectedIssue._id, // Ensure this is present and correct
                    book: selectedBook._id,
                    user: patronData._id,
                    issueDate: selectedIssue.issueDate,
                    returnDate,
                    rent: moment(returnDate).diff(moment(), 'days') * selectedBook.rentPerDay,
                    fine: 0,
                    issuedBy: user._id,
                });
                console.log(returnDate);
            }
            dispatch(HideLoading());
            if (response.success) {
                message.success(response.message);
                getData();
                setPatronId("");
                setReturnDate("");
                setValidated(false);
                setErrorMessage("");
                setSelectedBook(null);
                setOpen(false);
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
        if (type === "edit") {
            validate();
        }
    }, [open,patronId, returnDate]);

    return (

        <Modal
            title=""
            open={open}
            onCancel={() => setOpen(false)}
            footer={null}
            width={1000}
            centered
        >
            <div className='flex flex-col gap-2'>
                <h1 className='text secondary font-bold text-xl uppercase text-center'>
                    {type === "edit" ? "Edit/Renew Issue" : "Issue Book"}
                </h1>

                <div>
                    <span> Patron ID </span>
                    <input type='text'
                        value={patronId}
                        onChange={(e) => setPatronId(e.target.value)}
                        placeholder='Patron Id'
                        disabled={type === "edit"} />
                </div>

                <div>
                    <span> Return Date </span>
                    <input type='date'
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        placeholder='Return Date'
                        min={moment().format("YYYY-MM-DD")} />

                </div>

                {errorMessage && (
                    <span className='error-message'>
                        {errorMessage}
                    </span>
                )}

                {validated && <div>
                    <h1 className='text-sm'>
                        Patron: {patronData.name}
                    </h1>
                    <h1>
                        Number of Days:{" "}
                        {moment(returnDate).diff(moment(), 'days')}
                    </h1>
                    <h1>
                        Rent per Day: {selectedBook.rentPerDay}
                    </h1>
                    <h1>
                        Rent: {" "}
                        {moment(returnDate).diff(moment(), 'days') * selectedBook.rentPerDay}
                    </h1>
                </div>}

                <div className='flex justify end gap-2 w-100'>
                    <Button title='Cancel'
                        variant="outlined"
                        onClick={() => setOpen(false)} />
                    {type !== "edit" && <Button title='Validate'
                        disabled={patronId === '' || returnDate === ''}
                        onClick={validate} />}
                    {validated && <Button title={type === "edit" ? "Edit" : "Issue"}
                        onClick={onIssue}
                        disabled={patronId === '' || returnDate === ''} />}
                </div>
            </div>

        </Modal>
    )
}

export default IssueForm;