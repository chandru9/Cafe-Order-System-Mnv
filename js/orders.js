
const COLLECTION = "orders_test";   // change to "orders" for production
const COUNTER_DOC = "orderCounter_test";
async function placeOrder(){

  const items = Object.values(cart);


  if(items.length === 0){
    alert("Cart empty");
    return;
  }

  const counterRef = db.collection("counters").doc(COUNTER_DOC);

  try{

    await db.runTransaction(async (transaction)=>{

      const counterDoc = await transaction.get(counterRef);

      let orderNumber = 1;

      if(counterDoc.exists){
        orderNumber = counterDoc.data().value + 1;
      }

      transaction.set(counterRef,{value:orderNumber});

      const orderRef = db.collection(COLLECTION).doc();

      transaction.set(orderRef,{
        orderNumber,
        items,
        total: calculateTotal(),
        status: "CONFIRMED",
        time: new Date()
      });

    });

    cart = {};
    renderCart();

  }catch(e){
    console.error("Order failed", e);
  }

}

function listenOrders(){


  db.collection(COLLECTION)
    .orderBy("time","desc")
    .onSnapshot(snapshot=>{

      const div = document.getElementById("activeOrders");
      div.innerHTML = "";

      snapshot.forEach(doc=>{

        const order = doc.data();
        if(order.status === "PAID") return;
        let color = "black";
        let borderColor = "#000";
        if(order.status === "CONFIRMED") color = "red";
        if(order.status === "PREPARING") color = "orange";
        if(order.status === "DONE") color = "green";

        div.innerHTML += `
<div>
<b>Order #${order.orderNumber}</b><br>
Status: ${order.status}<br>
<button onclick="markPaid('${doc.id}')">Paid</button>
</div>
`;

      });

    });
}

function markPaid(id){

  db.collection(COLLECTION).doc(id).update({
    status: "PAID"
  })
    .then(()=>{
      console.log("Order marked as PAID");
    })
    .catch(err=>{
      console.error("Error updating order", err);
    });

}
