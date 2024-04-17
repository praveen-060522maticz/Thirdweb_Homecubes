import React from "react"
import { Col, Row } from "react-bootstrap"



const YoutubeComp = (link) => {
    console.log('link---->',link);
    return (
        <>
            {/* {CMS?.youtube && ( */}
            <Row className="mt-4 justify-content-center">
                <Col lg={5}>
                    <iframe
                        width="100%"
                        height="350"
                        src={"https://www.youtube.com/embed/NIeJpJ96-oY?si=VvtJ190743MqNjmp"}
                        // src={CMS?.youtube?.link}
                        title="YouTube video player"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen
                    />
                </Col>
            </Row>
            {/* )} */}
        </>
    )
}

export default YoutubeComp;