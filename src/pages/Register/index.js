import React, { useEffect } from 'react';
import { Form, message } from "antd";
import Button from "../../components/Button";
import { Link } from "react-router-dom";
import { RegisterUser } from '../../apiCalls/users';
import { useDispatch } from 'react-redux';
import { ShowLoading } from '../../redux/loadersSlice';
import { HideLoading } from '../../redux/loadersSlice';

function Register() {
    //  const navigate = useNavigate();
    const dispatch = useDispatch();
    const onFinish = async (values) => {
        try {
            dispatch(ShowLoading());
            const response = await RegisterUser(values);
            dispatch(HideLoading());
            if (response.success) {
                message.success(response.message);
                window.location.href = '/login';
            }
            else {
                message.error(response.message);
            }
        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            window.location.href = '/';
        }
    }, []);

    return (
        <div className='h-screen bg-primary flex items-center justify-center'>
            <div className='authentication-form bg-white p-3 rounded'>
                <h1 className='text-secondary text-2xl font-bold' >
                    LIBRARY - Register
                </h1>
                <hr />
                <Form layout='vertical'
                    onFinish={onFinish}>
                    <Form.Item
                        label='Name'
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Please provide your Name",
                            },
                        ]}>
                        <input type='text' placeholder='Name'></input>
                    </Form.Item>
                    <Form.Item
                        label='Email'
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: "Please provide your email",
                            },
                        ]}>
                        <input type='email' placeholder='Email'></input>
                    </Form.Item>
                    <Form.Item
                        label='Phone Number'
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: "Please provide your phone number",
                            },
                        ]}>
                        <input type='number' placeholder='Phone Number'></input>
                    </Form.Item>
                    <Form.Item
                        label='Password'
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Please provide your password",
                            },
                        ]}>
                        <input type='password' placeholder='Password'></input>
                    </Form.Item>

                    <div className='text-center mt-2 flex flex-col gap-1'>
                        <Button title="Register" type="submit" />
                        <Link to="/login" className='text-primary text-sm'>Already have an acconut? Click here to Login</Link>
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default Register