import React, { useEffect } from 'react';
import { Form, message } from "antd";
import Button from "../../components/Button";
import { Link } from "react-router-dom";
import { LoginUser } from '../../apiCalls/users';
import { useDispatch } from 'react-redux';
import { ShowLoading, HideLoading } from '../../redux/loadersSlice';

function Login() {
    // const navigate = useNavigate();
    const dispatch = useDispatch();
    const onFinish = async (values) => {
        try {
            dispatch(ShowLoading());
            const response = await LoginUser(values);
            dispatch(HideLoading());
            if (response.success) {
                message.success(response.message);
                localStorage.setItem("token", response.data);
                window.location.href = '/';
            }
            else {
                window.location.href = '/login';
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
                    LIBRARY - Login
                </h1>
                <hr />
                <Form layout='vertical'
                    onFinish={onFinish}>
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
                        <Button title="Login" type="submit" />
                        <Link to="/register" className='text-primary text-sm'>Don't have an acconut? Click here to Register</Link>
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default Login