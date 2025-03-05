import Invoice from "../models/invoice.js"
import axios from "axios";
import Customer from "../models/customer.js"
import Product from "../models/product.js"


const httpinvoice =  {
    postInvoice: async (req,res)=>{
        const authHeader = req.headers.authorization;
        let token = ""
        try{
            if(authHeader){
                token = authHeader.split(" ")[1]
            }else{
                throw new Error("no hay token");
                
            }
            const  {numbering_range_id,reference_code,observation,payment_form,payment_due_date,payment_method_code,billing_period,customer,products} = req.body;
            const existingCustomer = await Customer.findById(customer)
            if (!existingCustomer){
                return res.status(404).json({error: "cliente no encontrado "})
            }

            const productIds= products.map(p => p._id);
            const existingProducts = await Product.find({_id: {$in: productIds }})
            
            if(existingProducts.length !== products.length){
                return res.status(400).json({error: "productos no encontrados"})
            }
            const validatedInovice = {
                numbering_range_id,
                reference_code,
                observation,
                payment_form,
                payment_due_date,
                payment_method_code,
                billing_period,
                customer: existingCustomer,
                products: existingProducts
              }
           const apiResponse = await axios.post("https://api-sandbox.factus.com.co/v1/bills/validate",validatedInovice,{headers: {"Authorization": `Bearer ${token}`}})
        if(!apiResponse.data || !apiResponse.data.cufe){
            return res.status(400).json({error: "Error al crear factura"})
            
        }
        const {cufe, url, qr, qr_image, number} = apiResponse.data;
        const newInvoice = new Invoice({
            numbering_range_id,
            reference_code,
            observation,
            payment_form,
            payment_due_date,
            payment_method_code,
            billing_period,
            customer: existingCustomer,
            products: existingProducts,
            cufe,
            invoice_url: url,
            qr,
            qr_image,
            number,
        })
        const savedInvoice = await newInvoice.save()
     
        const populatedInvoice = await Invoice.findById(savedInvoice._id)
        .populate('customer')
        .populate('products.product')

        res.json(populatedInvoice)
    }catch(err){
         console.log(err, "Error al crear y enviar factura")
         res.status(500).json(err)
        }
    },

    getInvoice: async (req,res)=>{
        try{
            const invoices = await Invoice.find()
            .populate('customer')
            .populate('products.product')

        if (!invoices.length) {
           return res.status(404).json({ error: 'No se encontraron facturas' })
        }
        res.json(invoices)
        }catch(err){
            res.status(400).json({ error: 'Error interno del servidor' })
            console.log(err)
        }
    },  
}

export default httpinvoice