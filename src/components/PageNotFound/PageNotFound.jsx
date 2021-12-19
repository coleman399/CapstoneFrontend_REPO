import React, { useState, useEffect } from 'react';
import { Container, Figure, Image , Button, Stack } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ErrorPage from "../assets/404ErrorPage.png";
import './PageNotFound.css'



const PageNotFound = (props) => {
    const navigate = useNavigate()

    function handleOnClick(){
        navigate("/")
    }

    return (
        <div>
            <div className="text-center alert alert-primary" role="alert">
               😮 Oh no, you're lost! Let's get you home. 🚀
            </div>
            <Container>
                <Figure className="position-absolute top-50 start-50 translate-middle">
                    <Image src={ErrorPage} alt="404PageNotFound" className="img-fluid"/>
                </Figure>
                <Stack className="goHomeButton" direction="horizontal" gap={5}>
                    <p className="pageNotFoundHeader">Page Not Found</p>
                    <div className="vr" />
                    <Button onClick={()=>handleOnClick()}>Go Home</Button>
                </Stack>
            </Container>
        </div>
    )
}

export default PageNotFound;