import React, { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'
import useContractHook from '../../contract/contract'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import config from '../../lib/config'
function Refferal() {
    const contract = useContractHook();
    const { providers, UserAccountAddr, web3, web3p } = useSelector((state) => state.wallet_detail)
    const [refFee, setRefFee] = useState(0)
    useEffect(() => {
        getRefPer()
    }, [UserAccountAddr])

    const getRefPer = async () => {
        const getRef = await contract.getReffaralFees();
        console.log('getRef---->', getRef);
        setRefFee(getRef / 1e18)
    }

    const handleOnSubmit = async () => {
        const setData = await contract.changeRefferalFee(String(refFee * 1e18));
        toast[setData?.status ? "success" : "error"](setData?.status ? "Changed successfully" : "Error on contract")
    }
    return (
        <>
            <div>
                <div className="page-header">
                    <nav aria-label="breadcrumb">
                        Refferal fee percentage
                    </nav>
                </div>
                <div className="row">

                    <div className="col-lg-12 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                {/* <h4 className="card-title">Kyc List</h4> */}
                                <form className="forms-sample">
                                    <Form.Group>
                                        <label htmlFor="exampleInputName1">Select Project</label>
                                        <Form.Control type="number" className="form-control" id="buyerFee" placeholder="buyer fee" value={refFee} onChange={(e) => setRefFee(e.target.value)} />
                                        {/* <p className='mt-2' style={{ color: "red" }} >{Error?.projectId}</p> */}
                                    </Form.Group>
                                </form>
                                {(UserAccountAddr.toLowerCase() == config.AdminAddress.toLowerCase()) &&
                                    <button className='btn allbtn' type='button' onClick={handleOnSubmit} >SUBMIT</button>
                                }

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default Refferal