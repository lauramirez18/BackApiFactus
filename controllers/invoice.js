import Invoice from "../models/invoice.js"
import axios from "axios";
import Customer from "../models/customer.js"
import Product from "../models/product.js"


const httpinvoice =  {
    /* postInvoice: async (req, res) => {
        const authHeader = req.headers.authorization;
        let token =process.env.TOKEN;
    
        try {

    
            const { numbering_range_id, reference_code, observation, payment_form, payment_due_date, payment_method_code, billing_period, customer, products } = req.body;
    
            // Verificar si el cliente existe
            const existingCustomer = await Customer.findById(customer);
            if (!existingCustomer) {
                return res.status(404).json({ error: "Cliente no encontrado" });
            }
    
            // Obtener los IDs de los productos
            const productIds = products.map(p => p._id);
            const existingProducts = await Product.find({ _id: { $in: productIds } });
    
            // Validar si todos los productos existen
            if (existingProducts.length !== products.length) {
                return res.status(400).json({ error: "Algunos productos no fueron encontrados" });
            }
    
            // Construir el objeto para la API externa
            const validatedInvoice = {
                numbering_range_id,
                reference_code,
                observation,
                payment_form,
                payment_due_date,
                payment_method_code,
                billing_period,
                customer: existingCustomer._id, // Enviar solo el ID
                products: existingProducts.map(p => p._id) // Enviar solo los IDs
            };
    
            // Enviar a la API externa
            const apiResponse = await axios.post(
                "https://api-sandbox.factus.com.co/v1/bills/validate",
                validatedInvoice,
                { headers: { "Authorization":`Bearer ${process.env.TOKEN}` } }
            );
    
            // Verificar la respuesta de la API externa
            if (!apiResponse.data || !apiResponse.data.cufe) {
                console.log("Respuesta de la API externa:", apiResponse.data);
                return res.status(400).json({ error: "Error al crear factura en la API externa", details: apiResponse.data });
            }
    
            // Extraer datos de la API externa
            const { cufe, url, qr, qr_image, number } = apiResponse.data;
    
            // Guardar la factura en MongoDB
            const newInvoice = new Invoice({
                numbering_range_id,
                reference_code,
                observation,
                payment_form,
                payment_due_date,
                payment_method_code,
                billing_period,
                customer: existingCustomer._id, // Guardar solo el ID
                products: existingProducts.map(p => p._id), // Guardar solo los IDs
                cufe,
                invoice_url: url,
                qr,
                qr_image,
                number
            });
    
            const savedInvoice = await newInvoice.save();
    
            // Poblar la factura antes de enviarla como respuesta
            const populatedInvoice = await Invoice.findById(savedInvoice._id)
                .populate('customer')
                .populate('products');
    
            res.json(populatedInvoice);
    
        } catch (err) {
            res.status(500).json({ error: "Error interno", details: err.response?.data || err.message });
            console.log(token)
        } 
    }, */

    postInvoice: async (req, res) => {
        try {
            const token =/* process.env.TOKEN. */req.header('Authorization')
            console.log(token)
            if(!token) return res.status(403).json({ message: "token requerido"});
            
            const response = await axios.post("https://api-sandbox.factus.com.co/v1/bills/validate", req.body, {
                headers: { "Authorization": `Bearer ${token}` }
            })
            

            const { cufe, url, qr, qr_image, number } = response;
            const newInvoice = new Invoice({
                ...req.body,
                cufe,
                url,
                qr,
                qr_image,
                number,
            })
            await newInvoice.save()
            res.json(newInvoice)
        } catch (error) {
            res.status(500).json({ message: "Error al crear factura", error: error.response?.data });
        }
    },
    




    getInvoice: async (req,res)=>{
        try{
            const invoices = await Invoice.find()
            .populate('customer')
            .populate('products')

        if (!invoices.length) {
           return res.status(404).json({ error: 'No se encontraron facturas' })
        }
        res.json(invoices)
        }catch(err){
            res.status(400).json({ error: 'Error interno del servidor' })
           

        }
    },  
}

export default httpinvoice