// config.js
// Lista de vídeos da programação
// Tipos suportados: 'youtube', 'vimeo', 'googledrive'

const schedule = [
    {
    title: "1ªAula - EUPPC - Apresentação da Disciplina EUPPC",
    url: "https://youtu.be/Ol4YvwTu2tI?si=sGMBTiSbDu0N6CMG",
    type: "youtube"
    }, 
    { 
    title: "TV EUPPC",
    url: "https://youtu.be/FQKYXbr5rHo?si=LG89ea4FYvbR0pn6",
    type: "youtube"
    },
    {
    title: "2ª Aula - EUPPC - Leitura inspecional e leitura averiguativa",
    url: "https://youtu.be/AhX7j03dhxI?si=snqXwJ_b0MVc2PVM",
    type: "youtube"
    },
    { 
    title: "TV EUPPC",
    url: "https://youtu.be/FQKYXbr5rHo?si=LG89ea4FYvbR0pn6",
    type: "youtube"
    },
    {
    title: "Schooling the World (Escolarizando o Mundo), o último fardo do homem branco",
    url: "https://youtu.be/6t_HN95-Urs?si=J8XEwF_pH_51lqiB",
    type: "youtube"
    },
    {
    title: "3ª Videoaula - EUPPC - Por que devemos desinstalar a escola",
    url: "https://youtu.be/_Jj7tUgrFbA?si=KxPDpfuTWYlcq_Ah",
    type: "youtube"
    },
    { 
    title: "TV EUPPC",
    url: "https://youtu.be/FQKYXbr5rHo?si=LG89ea4FYvbR0pn6",
    type: "youtube"
    },
    {
    title: "4ª Videoaula - EUPPC - Introdução ao documentário Schooling the World",
    url: "https://youtu.be/wgpRePgjJUA?si=4XmTh4XfNjgBlVj7",
    type: "youtube"
    },
    {
    title: "5ª Aula - EUPPC - Reflexões sobre o documentário Schooling the World",
    url: "https://youtu.be/ocKkkbSAl4g?si=sDDTCXTo2wLSgJsM",
    type: "youtube"
    },
    { 
    title: "TV EUPPC",
    url: "https://youtu.be/FQKYXbr5rHo?si=LG89ea4FYvbR0pn6",
    type: "youtube"
    },
    {
    title: "6ª Aula - EUPPC  - Diferenças no processo educacional colonial a partir da catequese operadas por diferentes ordens religiosas",
    url: "https://youtu.be/2w0IWQP2WLA?si=AmluB6s5wr3bajN9",
    type: "youtube"
    },
    {
    title: '🎬 <a href="https://drive.google.com/file/d/1GbVr5RNUtdojCl2-Wnm8cov5zhBrNzmR/preview" target="_blank" style="color: #4CAF50; font-weight: bold;">Ver Filme Completo</a> Anna e o Rei (1999) - Trailer',
    url: "https://youtu.be/I6cF4_502aw?si=NWE5szdtOKzpi10p",
    type: "youtube"
    },
    {     
    title: "TV EUPPC",
    url: "https://youtu.be/FQKYXbr5rHo?si=LG89ea4FYvbR0pn6",
    type: "youtube"
    },
    {
    title: "Capitão Fantástico (2016)",
    url: "https://youtu.be/hkzW4ft8P0k?si=-vM-lQuRdcvoH8tZ",
    type: "youtube"
    },
    {
    title: "7ª Aula - EUPPC - O Casamento entre ciência e império",
    url: "https://youtu.be/6nsz0OzbsAQ",
    type: "youtube"
    },
    {     
    title: "TV EUPPC",
    url: "https://youtu.be/FQKYXbr5rHo?si=LG89ea4FYvbR0pn6",
    type: "youtube"
    },
    {
    title: "8ª Aula - EUPPC  - Etnografia e Observação Participante, um método de pesquisa social originada na estrutura colonial imperialista",
    url: "https://youtu.be/Xgj7YxQRwW4",
    type: "youtube"
    },
    {
    title: "O Homem que Viu o Infinito (The Man Who Knew Infinity, 2015)",
    url: "https://youtu.be/3Istn6lAnJY?si=t0HnAwpbNa2EvcBT",
    type: "youtube"
    },
    {     
    title: "TV EUPPC",
    url: "https://youtu.be/FQKYXbr5rHo?si=LG89ea4FYvbR0pn6",
    type: "youtube"
    },
    {
    title: '🎬 <a href="https://drive.google.com/file/d/1UIVtJrR_FNGcPvsXJwMgP12AtlZJArbV/preview" target="_blank" style="color: #4CAF50; font-weight: bold;">Ver Filme Completo</a> | A Sombra e a escuridão - Trailer',
    url: "https://youtu.be/aabrBqDyRkA?si=EViuD4XKW0FzXorH",
    type: "youtube"
    },
    {
    title: '🎬 <a href="https://drive.google.com/file/d/1d31t8BXwCRT0Z7TS7QEU_1gtO8EXiO71/preview" target="_blank" style="color: #4CAF50; font-weight: bold;">Ver Filme Completo</a> Vênus Negra (2010) - Trailer',
    url: "https://youtu.be/AIfYvmFxVCg?si=mzX7bbsG8Fdas0Kr",
    type: "youtube"
    },
    {     
    title: "TV EUPPC",
    url: "https://youtu.be/FQKYXbr5rHo?si=LG89ea4FYvbR0pn6",
    type: "youtube"
    },
    {
    title: "La Negra (1966)",
    url: "https://youtu.be/qbFJLxMGApE?si=ZRccWHPm-u6gv-_3",
    type: "youtube"
    },
    {
    title: "9ª Aula - EUPPC - Hibridismos culturais: Garífunas",
        url: "https://youtu.be/x07Vx6kEcmo",
        type: "youtube"
    },
    {     
    title: "TV EUPPC",
    url: "https://youtu.be/FQKYXbr5rHo?si=LG89ea4FYvbR0pn6",
    type: "youtube"
    },
    {
    title: "10ª Aula - EUPPC  - O Pós-colonial a partir de Stuart Hall, Ella Shohat e Chinua Achebe", //1:03:10
    url: "https://youtu.be/IRV6wkq9kjw?si=uH9gG6ZoNUjnRgHY",
    type: "youtube"
    }, 
    {
    title: 'A Missão (1986) - Trailer | <a href="https://drive.google.com/file/d/1YunkakApLq5eDzp1eJL3GsWl-iPbHlog/preview" target="_blank">🎬 Assistir Filme</a>',
    url: "https://youtu.be/o7aTvYJBHw4?si=_8gJ73ztoctemmgj",
    type: "youtube"
    },
    {     
    title: "TV EUPPC",
    url: "https://youtu.be/FQKYXbr5rHo?si=LG89ea4FYvbR0pn6",
    type: "youtube"
    },
    {
    title: "1492: A conquista do Paraíso",
    url: "https://youtu.be/KSv7zlSIBVc?si=XvZaEaXwiEIp-BLU",
    type: "youtube"
    },
    {
    title: '🎬 <a href="https://drive.google.com/file/d/1nosjwc8YC_J5QQAO2fkXxYjfhWaZarm9/preview" target="_blank" style="color: #4CAF50; font-weight: bold;">Ver Filme Completo</a> Diamante de Sangue (2006) - Trailer',
    url: "https://youtu.be/5wHxPWRlkUg?si=pJFOIZvfj6-e64Kq",
    type: "youtube"
    },
    {     
    title: "TV EUPPC",
    url: "https://youtu.be/FQKYXbr5rHo?si=LG89ea4FYvbR0pn6",
    type: "youtube"
    },
    {
    title: '🎬 <a href="https://drive.google.com/file/d/1MioKnMk7mH6Mqla0b0rRRFW7ac6yCbI5/preview" target="_blank" style="color: #4CAF50; font-weight: bold;">Ver Filme Completo</a> Pantera Negra (2018) - Trailer',
    url: "https://youtu.be/_Z3QKkl1WyM?si=hZctbT8qsvh65C3G",
    type: "youtube"
    },
    {
    title: "O Povo Brasileiro Darcy Ribeiro - Matriz Tupi - parte 1",
    url: "https://youtu.be/rQOPdiEdX24?si=cgbh3kTfFSkR6V9D",
    type: "youtube"
    },
    {     
    title: "TV EUPPC",
    url: "https://youtu.be/FQKYXbr5rHo?si=LG89ea4FYvbR0pn6",
    type: "youtube"
    },
    {
    title: "O Povo Brasileiro Darcy Ribeiro - Matriz Lusa - parte 2",
    url: "https://youtu.be/ZxOCLwMQ_ik?si=gxtfUoiCSJ0nchOY",
    type: "youtube"
    },
    {
    title: "O Povo Brasileiro Darcy Ribeiro - Matriz Afro - parte 3",
    url: "https://youtu.be/vwj1GBEYr_s?si=v2dsjnfUrK1nMz2_",
    type: "youtube"
    },
    {     
    title: "TV EUPPC",
    url: "https://youtu.be/FQKYXbr5rHo?si=LG89ea4FYvbR0pn6",
    type: "youtube"
    },
    {
    title: "O Povo Brasileiro Darcy Ribeiro - Encontros e Desencontros - parte 4",
    url: "https://youtu.be/Dl77HvU2fUk?si=DvcXRKglW8-Yke8w",
    type: "youtube"
    },
    {
    title: "O Povo Brasileiro Darcy Ribeiro - O Brasil Crioulo - parte 5", //26:03
    url: "https://youtu.be/oObneYXQedk?si=JmNyujDAnZWTzIoA",
    type: "youtube"
    },
    {     
    title: "TV EUPPC",
    url: "https://youtu.be/FQKYXbr5rHo?si=LG89ea4FYvbR0pn6",
    type: "youtube"
    }
    ];
