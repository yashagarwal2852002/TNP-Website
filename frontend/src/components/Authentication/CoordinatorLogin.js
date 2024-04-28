import React from 'react';
import { useForm } from 'react-hook-form';
import { FormControl, Button } from '@chakra-ui/react';
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { useState } from "react";
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

export default function CoordinatorLogin() {
    const { handleSubmit, formState: { isSubmitting } } = useForm();
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const toast = useToast();
    const navigate = useNavigate();

    const handleClick = () => setShow(!show);
    const submitHandler = async () => {
        if (!email || !password) {
            toast({
                title: "Please Fill all the fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                }
            };

            const { data } = await axios.post("/api/user/login", {
                emailOrScholarNo: email,
                password: password,
                role: "Coordinator"
            }, config);

            toast({
                title: "Login Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            navigate('/coordinatorDashboard');
        } catch (error) {
            toast({
                title: "Error",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };
    return (
        <form onSubmit={handleSubmit(submitHandler)}>
            <FormControl className="loginScholarNo" isRequired mb="10px">
                <Input
                    variant='flushed'
                    type="email"
                    value={email}
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete='off'
                />
            </FormControl>
            <FormControl id="password2" isRequired mb="10px">
                <InputGroup size="md">
                    <Input
                        variant='flushed'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type={show ? "text" : "password"}
                        placeholder="Password"
                        autoComplete="off"
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" bg="white" onClick={handleClick}>
                            {show ? <ViewOffIcon /> : <ViewIcon />}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Button colorScheme="blue" width="100%" mt="30px" isLoading={isSubmitting}  type='submit'>
                Login
            </Button>
        </form>
    )
}
