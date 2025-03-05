 import Product from "../models/product.js"

 const httpproduct =  {
    postProduct: async (req,res)=>{
        try{
            const  {code_reference,name,quantity,discount_rate, price,tax_rate,unit_measure_id,standard_code_id,is_excluded,tribute_id,withholding_taxes} = req.body;
            const newProduct = new Product({
                code_reference,
                name,
                quantity,
            discount_rate,
                price,
                tax_rate,
                unit_measure_id,
                standard_code_id,
                is_excluded,
                tribute_id,
                withholding_taxes,
            })
            await newProduct.save()
            res.json(newProduct)
        }catch(err){
            res.status(500).json(err)
        }
    },

    getProduct: async (req,res)=>{
        try{
            const product = await Product.find()
            res.json(product)
        }catch(err){
            res.status(400).json({ error: 'Error al obtener lista de productos' })
            console.log(err)
        }
    },
    getProductById: async (req,res)=>{
        try{
            const product = await Product.findById(req.params.id)
            res.json(product)
        }catch(err){
            res.status(400).json({ error: 'Error al obtener producto' })
            console.log(err)
        }
    },
    updateProduct: async (req,res)=>{
        try{
            const product = await Product.findByIdAndUpdate(req.params.id,req.body,{new:true})
            res.json(product)
        }catch(err){
            res.status(400).json({ error: 'Error al actualizar producto' })
            console.log(err)
        }
    },
}

export default httpproduct;