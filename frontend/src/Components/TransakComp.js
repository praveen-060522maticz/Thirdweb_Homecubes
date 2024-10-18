import React, { useEffect } from 'react'
import { Transak } from '@transak/transak-sdk';
import Config from '../config/config'

const TransakComp = ({handleHideTransak, handleTransakData}) => {



    const transakConfig = {
        apiKey: Config.TRANSAK_API_KEY, // (Required)
        environment: Transak.ENVIRONMENTS.STAGING, // (Required)
        network : "BSC",
        cryptoCurrencyList:["USDT"],
        // widgetHeight:"70%"
    };

    let transak = new Transak(transakConfig);

    useEffect(() => {
        transak.init();

        // Cleanup code
        return () => {
            transak.close();
        };
    }, []);

    // To get all SDK events
    Transak.on('*', (data) => {
        handleTransakData(data)
        console.log("transakData", data);
    });

    // This will trigger when the user closed the widget
    Transak.on(Transak.EVENTS.TRANSAK_WIDGET_CLOSE, (orderData) => {
        handleHideTransak()
        transak.cleanup();
    });

    // This will trigger when the user marks payment is made
    Transak.on(Transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
        console.log(orderData);
        transak.cleanup();
    });

    return (
        <div>
            <div id="transakMount"></div>
        </div>

    )
}

export default TransakComp