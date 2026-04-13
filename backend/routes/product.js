const express = require('express')
const router = express.Router();
const db = require('../db/database');
const { default: Pagination } = require('../../frontend/src/components/Pagination');



// get products  with server side pagination


router.get( '/' , (req ,res) =>{
    try {
         
        const page = Math.max(1, parseInt(req.query.page)  || 1) ;
        const pageSize = Math.max(1, parseInt(req.query.pageSize) || 10); 

        const search = req.query.search  ? `%${req.query.categoryId}%` : null ;

        const catFilter = req.query.categoryId ? parseInt(req.query.categoryId) : null;


    // SERVER-SIDE PAGINATION — only fetch rows for current page
    // page=9, pageSize=10 → offset=80 → fetches rows 81 to 90

    const offset = (page-1) * pageSize ;  

    // build where clause dynamically

    let where  =   'WHERE 1=1';

     const args = [];
     if(search) {
        where = where + 'AND( p. ProductName LIKE ? OF c.categoryName LIKE ?)';
        args.push(search , search);
     }

     if(catFilter) {
        where  = where  +  'AND  p.CategoryId = ?';
        args.push(catFilter);
     }

     // count total matching records

     const {total} = db.prepare(`
        SELECT COUNT(*) AS total FROM products p  JOIN categories c ON  p.CategroryId = c.CategoryId
        ${where}
        `).get(...args);



        // fetch only the current page rows using LIMIT offset
const products = db.prepare(`
      SELECT
        p.ProductId,
        p.ProductName,
        p.CategoryId,
        c.CategoryName,
        p.Price,
        p.Stock,
        p.Description,
        p.CreatedAt
      FROM products p
      JOIN categories c ON p.CategoryId = c.CategoryId
      ${where}
      ORDER BY p.ProductId DESC
      LIMIT ? OFFSET ?
    `).all(...args, pageSize, offset);


    res.json({
         success : true,
         data : products, 
         pagination :{
            page , 
            pageSize , total, 
            totalPages : Math.max.ceil(total / pageSize),
            from : total === 0 ? 0 : offset + 1,
            to: Math.min(offset + pageSize , total),
         }
    });

    } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


  router.get('/:id' , (req , res) =>{
    try {
         
        const row = db.prepare(`
            SELECT p.* , c.CategoryName
            FROM products p 
             JOIN       categories c ON p.CategoryId = c.CategoryId 
             WHERE  p .ProductId = ? 
            
            `).get(req.params.id) ; 

            if(!row) {
                return res.status(404).json({
                    success : false , 
                    message : 'Product Not found'
                }) 
            }

            res.json({
                 success : true ,
                  data : row
            })

    } catch (error) {

console.log("something wnet wrong during fetching the single product");

        res.status(500).json({
            success : false  , message : error.message
        })
    }

  })


  // Post -  create product

  router.post('/:id' , (req , res) =>{
    const { ProductName , CategoryId , Price ,Stock , Description} = req.body ;

    if(!ProductName?.trim()) {
        return res.status(400).json({
            success : false , 
            message :"ProductName required"
        })

    }

     if (!CategoryId){
           return res.status(400).json({ success: false, message: 'Category is required' }); 
     }

  if (Price == null || isNaN(Price)){
       return res.status(400).json({ success: false, message: 'Valid price is required' }); 
  }
   
  try {
    
    const result = db.prepare(`
        ERT INTO products (ProductName, CategoryId, Price, Stock, Description)
      VALUES (?, ?, ?, ?, ?)
    `).run(ProductName.trim(), CategoryId, parseFloat(Price), parseInt(Stock) || 0, Description || '');
    

    const newRow = db.prepare(`
      SELECT p.*, c.CategoryName FROM products p
      JOIN categories c ON p.CategoryId = c.CategoryId
      WHERE p.ProductId = ?
    `).get(result.lastInsertRowid);
    

   res.status(201).json({ success: true, data: newRow, message: 'Product created successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});



/// put -- update product

router.put('/:id', ( req ,res) => {
    const { ProductName , CategoryId , Price , Stock , Description} = req.body;
    if (!ProductName?.trim()){
         return res.status(400).json({ success: false, message: 'Product name is required' });   
    }

  if (!CategoryId){
    return res.status(400).json({ success: false, message: 'Category is required' });
  }


  try {
     
    const exist = db.prepare(
        ' SELECT  ProductId FROM  products WHERE  ProductId = ? '
    ).get(req.params.id)

if (!exist){
    return res.status(404).json({ success: false, message: 'Product not found' });
}
      
 db.prepare(`
      UPDATE products
      SET ProductName=?, CategoryId=?, Price=?, Stock=?, Description=?
      WHERE ProductId=?
    `).run(
      ProductName.trim(), CategoryId,
      parseFloat(Price) || 0, parseInt(Stock) || 0,
      Description || '', req.params.id
    );


 const updated = db.prepare(`
      SELECT p.*, c.CategoryName FROM products p
      JOIN categories c ON p.CategoryId = c.CategoryId
      WHERE p.ProductId = ?
    `).get(req.params.id);

    res.json({ success: true, data: updated, message: 'Product updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
    
  

});


// Delete  - Delete Product

router.delete('/:id', (req , res) =>{
    try{

        const exist = db.prepare(
            'SELECT ProductId FROM products WHERE ProductId = ?'
    ).get(req.params.id);

    if (!exist){
         return res.status(404).json({ success: false, message: 'Product not found' }); 
    }
    
        
    

db.prepare('DELETE FROM products WHERE ProductId = ?').run(req.params.id);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }


});

module.exports.router;

