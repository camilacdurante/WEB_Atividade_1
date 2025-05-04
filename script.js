const posicoes = ['up', 'down', 'left', 'right'];
let posicaoCorreta = '';

function gerarPergunta() {
    setTimeout(() => {
      document.getElementById("pergunta").play(); 
    }, 500);
    const operadores = ['+', '-', '×', '÷'];
    const operador = operadores[Math.floor(Math.random() * operadores.length)];

    let n1 = Math.floor(Math.random() * 10) + 1;
    let n2 = Math.floor(Math.random() * 10) + 1;
    let correta;

    switch (operador) {
        case '+':
        correta = n1 + n2;
        break;
        case '-':
        // Garante que não tenha resultado negativo
        if (n2 > n1) [n1, n2] = [n2, n1];
        correta = n1 - n2;
        break;
        case '×':
        correta = n1 * n2;
        break;
        case '÷':
        // Garante divisão exata
        correta = n1;
        n2 = Math.floor(Math.random() * 9) + 1;
        n1 = correta * n2;
        break;
    }

    document.getElementById("questao").innerText = `Quanto é ${n1} ${operador} ${n2}?`;

    // Gerar 3 alternativas incorretas
    let respostasErradas = new Set();
    while (respostasErradas.size < 3) {
        let incorretas = Math.floor(Math.random() * 5) + 1;
        let alternativa = correta + (Math.random() > 0.5 ? incorretas : -incorretas);
        if (alternativa !== correta && alternativa >= 0) respostasErradas.add(alternativa);
    }

    const todasRespostas = [...respostasErradas];
    const posCorreta = Math.floor(Math.random() * 4);
    todasRespostas.splice(posCorreta, 0, correta);

    posicaoCorreta = posicoes[posCorreta];

    posicoes.forEach((pos, i) => {
        document.getElementById(pos).innerText = todasRespostas[i];
    });
}

async function iniciarReconhecimento() {
  const reconhecer = speechCommands.create('BROWSER_FFT');
  await reconhecer.ensureModelLoaded();

  reconhecer.listen(resultado => {
    const pontuacao = resultado.scores;
    const labels = reconhecer.wordLabels();
    const topIndex = pontuacao.indexOf(Math.max(...pontuacao));
    const comando = labels[topIndex];

    if(comando == "up" || comando == "down" || comando == "left" || comando == "right")
      document.getElementById("status").innerText = `Você disse: ${comando}`;

    if (posicoes.includes(comando)) {
      if (comando === posicaoCorreta) {
        document.getElementById("deuCerto").innerText = "✅ Acertou! Próxima pergunta...";
        document.getElementById("acertou").play();
        setTimeout(() => {
        document.getElementById("deuCerto").innerText = "";
        }, 1000);
        //alert("✅ Acertou! Próxima pergunta...");
        gerarPergunta();

      } else {
        //alert("❌ Errou! Fim de jogo.");
        //document.getElementById("deuCerto").innerText = " Errou! Fim de jogo."
        //document.getElementById("status").innerText = "Jogo encerrado.";
        reconhecer.stopListening();
        document.getElementById("deuCerto").innerText = ":❌: Errou! Fim de jogo.";
        document.getElementById("status").innerText = "Jogo encerrado.";
        document.getElementById("errou").play();
        setTimeout(() => {
          window.location.href = "home.html";
        }, 2000);            
      }
    }
  }, {
    includeSpectrogram: false,
    probabilityThreshold: 0.75
  });
}


gerarPergunta();
iniciarReconhecimento();
