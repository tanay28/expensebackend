const mongoose = require('mongoose');
const config = require('config');
const db_local = config.get('mongoURI_LOCAL');
const db_atlas = config.get('mongoURI_MongoAtlas');
const db_atlas_emp = config.get('mongoURI_AtlasEmp');

//---------- For Local DB -------------//
const connectDB_local = async () => {
  try {
    await mongoose.connect(db_local, {
      useNewUrlParser: true
    });
    console.log('MongoDB Local Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
//--------------- END ------------------//

//---------- For Atlas DB -------------//
const connectDB_atlas = async () => {
  try {
    await mongoose.connect(db_atlas, {
      useNewUrlParser: true
    });
    //console.log(db_atlas);
    console.log('MongoDB Atlas Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
//--------------- END ------------------//


//---------- For Atlas DB Emp -------------//
// const connectDB_atlas_emp = async () => {
//   try {
//     await mongoose.connect(db_atlas_emp, {
//       useNewUrlParser: true
//     });
//     //console.log(db_atlas);
//     console.log('MongoDB Atlas Connected...');
//   } catch (err) {
//     console.error(err.message);
//     process.exit(1);
//   }
// };
//--------------- END ------------------//


//module.exports = connectDB_atlas_emp;
module.exports = connectDB_atlas;
//module.exports = connectDB_local;
