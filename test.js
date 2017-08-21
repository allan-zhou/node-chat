let arr = [{ id: 1 }, { id: 2 }];

let ret = 
arr.find(e => {
  console.log(e);
  return e.id == 3
});

console.log(ret);