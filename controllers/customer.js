import Customer from "../models/customer.js"

const httpcustomer =  {
    postCustomer: async (req,res)=>{
        try{
            const  {identification,dv,company,trade_name,names,address,email,phone,legal_organization_id,tribute_id,identification_document_id,municipality_id} = req.body;
            const newCustomer = new Customer({
                identification,
                dv,
                company,
                trade_name,
                names,
                address,
                email,
                phone,
                legal_organization_id,
                tribute_id,
                identification_document_id,
                municipality_id,
            })
            await newCustomer.save()
            res.json(newCustomer)
        }catch(err){
            res.status(500).json(err)
        }
    },

    getCustomer: async (req,res)=>{
        try{
            const customer = await Customer.find()
            res.json(customer)
        }catch(err){
            res.status(400).json({ error: 'Error al obtener lista de customers' })
            console.log(err)
        }
    },
    updateCustomer: async (req,res)=>{
        try{
            const customer = await Customer.findByIdAndUpdate(req.params.id,req.body,{new:true})
            res.json(customer)
        }catch(err){
            res.status(400).json({ error: 'Error al actualizar customer' })
            console.log(err)
        }
    },
}

export default httpcustomer;