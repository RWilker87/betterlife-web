import React, { useState, useEffect } from 'react';
import {
    Paper, Typography, Button, Divider, TextField
} from '@material-ui/core';
import Header from '../Header/Header';
import Styles from './Post.module.css';
import forumService from '../../Services/Forum/Forum-service';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../Footer/Footer';
import { jwtDecode } from 'jwt-decode'; // Corrigindo a importação

const Post = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [resposta, setResposta] = useState('');

    useEffect(() => {
        listarDadosPost();
    }, [id]);

    const listarDadosPost = async () => {
        try {
            const response = await forumService.listarDadosPostPorID(id);
            if (!response.error) {
                setPost(response.data);
            } else {
                alert(response.message);
            }
        } catch (error) {
            alert(error.message || 'Não foi encontrado nenhum post');
        }
    };

    // Função para pegar o ID do usuário logado
    const getLoggedUserId = () => {
        const token = localStorage.getItem('token'); // Obtendo o token do localStorage
        if (token) {
            const decoded = jwtDecode(token); // Usando jwtDecode
            return decoded._id; // Supondo que o ID do usuário está no payload do token
        }
        return null; // Retornar null se não houver token
    };

    const handleAddResposta = async () => {
        try {
            const usuarioidresposta = getLoggedUserId(); // Pegando o ID do usuário logado

            const response = await forumService.addResposta(id, { usuarioidresposta, resposta });
            if (!response.error) {
                alert('Resposta adicionada com sucesso');
                setResposta(''); // Limpar o campo de resposta após sucesso
                listarDadosPost(); // Atualizar os dados do post
            } else {
                alert(response.message);
            }
        } catch (error) {
            alert(error.message || 'Erro ao adicionar resposta');
        }
    };

    const handleBackToForum = () => {
        navigate('/forum');
    };

    return (
        <>
            <Header />
            <div className={Styles.conteudoContainer}>
                {post ? (
                    <>
                        <Paper className={Styles.postContainer}>
                            <Typography variant="h4" className={Styles.postTitle}>
                                {post.pergunta}
                            </Typography>
                            <Divider className={Styles.divider} />
                            <Typography variant="body1" className={Styles.postResposta}>
                                {post.resposta}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" className={Styles.postCategoria}>
                                Categoria: {post.nomecategoria}
                            </Typography>
                        </Paper>

                        {/* Formulário para adicionar resposta */}
                        <div className={Styles.respostaContainer}>
                            <TextField
                                label="Adicione sua resposta"
                                multiline
                                rows={4}
                                value={resposta}
                                onChange={(e) => setResposta(e.target.value)}
                                variant="outlined"
                                fullWidth
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleAddResposta}
                                style={{ marginTop: '16px' }}
                            >
                                Enviar Resposta
                            </Button>
                        </div>

                        <div className={Styles.buttonContainer}>
                            <Button variant="contained" color="primary" onClick={handleBackToForum}>
                                Voltar ao Fórum
                            </Button>
                        </div>
                    </>
                ) : (
                    <Typography variant="h6" color="error">
                        Carregando post...
                    </Typography>
                )}
            </div>
            <Footer />
        </>
    );
};

export default Post;
