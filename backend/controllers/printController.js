const usb = require('usb');

const sendZPLToPrinter = (zpl) => {
    const device = usb.findByIds(0x0a5f, 0x0001); // Remplacez ces IDs par ceux de votre imprimante Zebra

    if (device) {
        device.open();
        const endpoint = device.interfaces[0].endpoints[0];

        endpoint.transfer(zpl, (error) => {
            if (error) {
                console.error("Error sending ZPL to printer:", error);
            } else {
                console.log("ZPL sent successfully to printer");
            }
            device.close();
        });
    } else {
        console.error("Printer not found");
    }
};

module.exports = { sendZPLToPrinter };
