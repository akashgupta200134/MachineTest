const express = require('express')

const router = express.Router();
const db = require("../db/database")


//get all categories

router.get('/',(req , res) =>{
    try {
         
        const data = db.prepare(
            'SELECT * FROM categories ORDER BY CategoryName'
        ).all();

        res.json(({
            success : true , data
        }))


    } catch (error) {
        res.status(500).json({
            success :false , 
            message : error.message
        }) 
        console.log("Error while fetching the Categories");
         
         
        
    }
})


// get single category
router.get("/:id", (req, res) => {
  try {
    const row = db
      .prepare("SELECT * FROM categories WHERE CategoryId = ?")
      .get(req.params.id);

    if (!row) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      data: row,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    console.log("Getting error while fetching the single category");
  }
});


// Post - create Category 

router.post('/' , (req ,res) => {

    const {CategoryName , Description} = req.body;

    if(!CategoryName?.trim()){
        return(
            res.status(400).json({
                success : false ,
                message : "Category name is required"
            })
        )
    }

    try {

        const result  = db.prepare(
            'INSERT INTO categories (CategoryName , Description) VALUES(? , ?)'
        ).run(CategoryName.trim() , Description || '');

        const newRow = db.prepare(
    'SELECT * FROM categories WHERE CategoryId = ?'
    ).get(result.lastInsertRowid);
     
     res.status(201).json({ success: true, data: newRow, message: 'Category created successfully' }) 


    } 
    
    catch (error) {

    if (err.message.includes('UNIQUE')){
    return(
    res.status(400).json({ success: false, message: 'Category name already exists' })
     )}


    res.status(500).json({ success: false, message: err.message });
    console.log('Getting error while creating category');
    

}
}
);


// update category - put

router.put('/:id', (req , res) => {
    const {CategoryName , Description} = req.body;

    if(!CategoryName?.trim()) {
        return (
            res.status(400).json({
                success:false,
                message : "Category name is required"
            })
        )
    }

    try {
         
        const exists = db.prepare(
            'SELECT CategoryId FROM categories WHERE CategoryId = ?'
        ).get(req.params.id);

        if(!exists){
            return (
                res.status(400).json({
                    success:false , 
                    message : 'Categorynot found'
                })
            )

        }


              // category updation here 
        db.prepare(
            'UPDATE categories SET CategoryName = ?, Description = ? WHERE CategoryId = ?'
        ).run(CategoryName.trim() , Description || '' , req.params.id);

  
        const updated = db.prepare(
            ' SELECT * FROM categories WHERE CategoryId = ?'
        ).get(req.params.id)

       res.json({ success: true, data: updated, message:'Category updated successfully' });
  } 
  
  catch (err) {
    if (err.message.includes('UNIQUE')){
      return (
        res.status(400).json({ success:false, message:'Category name already exists'})
      )
    }
     
    res.status(500).json({ success: false, message: err.message });
  }
})


//Delete Category

router.delete('/:id' , (req, res) =>{
    try {
         
        const exists = db.prepare(
        'SELECT CategoryId FROM categories WHERE CategoryId = ?'  
        ).get(req.params.id);

         if (!exists){
          return res.status(404).json({ success: false, message: 'Category not found' });
         }

// Block delete if products exist under this category

const {cnt} = db.prepare(
    'SELECT COUNT(*) as cnt FROM  products WHERE CategoryId = ?'
).get(req.params.id);

if(cnt > 0 ){
    return(
        res.status(400).json({
            success:false,
            message : `Can not delete - ${cnt} product(s) use this category`
        })
    ) 
}


db.prepare('DELETE FROM categories WHERE CategoryId = ?').run(req.params.id);
res.json({
    success : true , message: "category delete sucessfully"
})

    } catch (error) {
        res.status(500).json({ success: false, message: err.message }); 

    }
})


router.get('/test', (req, res) => {
  res.send("TEST WORKING");
}); 



module.exports = router;