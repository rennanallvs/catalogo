var pagto="";
var cats=["Todos"].concat(perfumes.map(function(p){return p.cat}).filter(function(c,i,a){return a.indexOf(c)===i}));
var atual="Todos", carrinho={};
function brl(v){return "R$ "+v.toFixed(2).replace(".",",")}
function achar(id){return perfumes.filter(function(p){return p.id===id})[0]}

var MARCAS=["Eudora","O Boticário"], marcaAtual="Todas";
function cartao(p){
  return '<div class="card"><div class="foto" onclick="ver('+p.id+')">'+(p.img?'<img src="'+p.img+'" alt="'+p.nome+'" loading="lazy">':p.foto)+'</div><div class="marca">'+p.b+' · '+p.marca+'</div><div class="nome" onclick="ver('+p.id+')">'+p.nome+'</div><div class="nota">'+p.nota+'</div><div class="linha"><span class="preco">'+(p.de?'<span class="de">'+brl(p.de)+'</span>':'')+brl(p.preco)+'</span><button class="add" onclick="mudar('+p.id+',1)">+ Adicionar</button></div></div>';
}
function mostrar(){
  var q=document.getElementById("busca").value.toLowerCase();
  document.getElementById("marcas").innerHTML=["Todas"].concat(MARCAS).map(function(m){
    return '<button class="'+(m===marcaAtual?'on':'')+'" onclick="marcaAtual=\''+m+'\';mostrar()">'+m+'</button>';
  }).join("");
  document.getElementById("chips").innerHTML=cats.map(function(c){
    return '<button class="'+(c===atual?'on':'')+'" onclick="atual=\''+c+'\';mostrar()">'+c+'</button>';
  }).join("");
  var res=perfumes.filter(function(p){
    return (marcaAtual==="Todas"||p.b===marcaAtual)&&(atual==="Todos"||p.cat===atual)&&(p.b+p.nome+p.marca+p.nota).toLowerCase().indexOf(q)>-1;
  });
  var html="";
  MARCAS.forEach(function(m){
    var it=res.filter(function(p){return p.b===m});
    if(!it.length)return;
    if(marcaAtual==="Todas")html+='<h2 class="secao">'+m+'<small>'+it.length+' perfumes</small></h2>';
    html+=it.map(cartao).join("");
  });
  document.getElementById("lista").innerHTML=html||'<p class="vazio">Nenhum perfume encontrado.</p>';
}

function mudar(id,d){
  carrinho[id]=(carrinho[id]||0)+d;
  if(carrinho[id]<=0)delete carrinho[id];
  atualizar();
}

function atualizar(){
  var ids=Object.keys(carrinho), qtd=0, total=0;
  document.getElementById("itens").innerHTML=ids.length?ids.map(function(id){
    var p=achar(+id), n=carrinho[id];
    qtd+=n; total+=n*p.preco;
    return '<div class="item"><span class="ic">'+(p.img?'<img src="'+p.img+'" alt="">':p.foto)+'</span><div class="tx">'+p.nome+'<small>'+p.marca+' · '+brl(p.preco)+'</small></div><div class="qtd"><button onclick="mudar('+p.id+',-1)">−</button><span>'+n+'</span><button onclick="mudar('+p.id+',1)">+</button></div></div>';
  }).join(""):'<p class="vazio">Carrinho vazio.</p>';
  document.getElementById("total").textContent=brl(total);
  document.getElementById("fabq").textContent="🛒 "+qtd+(qtd===1?" item":" itens");
  document.getElementById("fabt").textContent=brl(total);
  document.getElementById("fab").classList.toggle("ver",qtd>0);
  if(!qtd)abrir(false);
}

function ver(id){
  var p=achar(id);
  document.getElementById("zFoto").innerHTML=p.img?'<img src="'+p.img+'" alt="'+p.nome+'">':p.foto;
  document.getElementById("zMarca").textContent=p.b+" · "+p.marca;
  document.getElementById("zNome").textContent=p.nome;
  document.getElementById("zNota").textContent=p.nota;
  document.getElementById("zPreco").innerHTML=(p.de?'<span class="de">'+brl(p.de)+'</span>':'')+brl(p.preco);
  document.getElementById("zAdd").onclick=function(){mudar(p.id,1);fechar()};
  document.getElementById("zoom").classList.add("ver");
}
function fechar(){document.getElementById("zoom").classList.remove("ver")}
function abrir(v){document.getElementById("fundo").classList.toggle("ver",v)}

function renderPag(){
  document.getElementById("pags").innerHTML=FORMAS.map(function(f,i){
    return '<button class="'+(f===pagto?'on':'')+'" onclick="escolherPag('+i+')">'+f+'</button>';
  }).join("");
}
function escolherPag(i){pagto=FORMAS[i];document.getElementById("erro").textContent="";renderPag()}
function enviar(){
  var ids=Object.keys(carrinho);
  if(!ids.length)return;
  var nome=document.getElementById("cliente").value.trim(), total=0;
  if(!nome){document.getElementById("erro").textContent="Digite seu nome para enviar o pedido.";document.getElementById("cliente").focus();return}
  if(!pagto){document.getElementById("erro").textContent="Escolha a forma de pagamento para enviar o pedido.";return}
  var msg="Olá! Meu nome é "+nome+" e quero fazer um pedido:\n\n";
  ids.forEach(function(id){
    var p=achar(+id), n=carrinho[id];
    total+=n*p.preco;
    msg+="• "+n+"x "+p.nome+" ("+p.marca+") - "+brl(n*p.preco)+"\n";
  });
  msg+="\nTotal: "+brl(total);
  msg+="\nForma de pagamento: "+pagto;
  window.open("https://wa.me/"+WHATS+"?text="+encodeURIComponent(msg),"_blank");
}

document.getElementById("contato").href="https://wa.me/"+WHATS;
renderPag();
mostrar();atualizar();
