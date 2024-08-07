import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from "./Register.module.css";
import logo from "../../Assets/logo.png";
import { cpf, cnpj } from 'cpf-cnpj-validator';
import { registerUser } from '../../Services/Register/Register-service';

const Register = () => {
  const [tipoCadastro, setTipoCadastro] = useState('pessoaComum');
  const [dadosCadastro, setDadosCadastro] = useState({
    email: '',
    senha: '',
    nome: '',
    telefone: '',
    documento: '',
  });
  const [erro, setErro] = useState('');
  const [confirmacaoSenha, setConfirmacaoSenha] = useState('');
  const [showPasswordTooltip, setShowPasswordTooltip] = useState(false);
  const navigate = useNavigate();


  const [senhaValida, setSenhaValida] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });


  const alterarDados = (e) => {
    const { name, value } = e.target;
    setDadosCadastro({
      ...dadosCadastro,
      [name]: value
    });
  };

  const validarDocumento = (tipo, documento) => {
    if (tipo === 'pessoaComum') {
      return cpf.isValid(documento);
    } else if (tipo === 'departamento') {
      return cnpj.isValid(documento);
    } else if (tipo === 'veterinaria') {
      return /^\d{6}$/.test(documento);
    }
    return false;
  };

  const validarSenha = (senha) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(senha);
    const hasLowerCase = /[a-z]/.test(senha);
    const hasNumber = /[0-9]/.test(senha);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(senha);

    return senha.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  };

  const submeter = async (e) => {
    e.preventDefault();
    if (dadosCadastro.senha !== confirmacaoSenha) {
      alert('Senhas diferentes');
      return;
    } else if (!validarSenha(dadosCadastro.senha)) {
      alert('A senha deve ter no mínimo 8 caracteres, incluir uma letra maiúscula, uma letra minúscula, um número e um caractere especial.');
      return;
    } else if (!validarDocumento(tipoCadastro, dadosCadastro.documento)) {
      alert('Documento inválido');
      return;
    }

    try {
      const userData = {
        ...dadosCadastro,
        tipousuarioid: tipoCadastro === 'pessoaComum' ? 4 : tipoCadastro === 'veterinaria' ? 2 : 3
      };

      const response = await registerUser(JSON.stringify(userData));

      if (response.error === false) {
        alert('Usuário cadastrado com sucesso!');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }

    } catch (error) {
      alert(error.message || 'Erro ao registrar usuário');
    }
  };

  useEffect(() => {
    setDadosCadastro(prevState => ({
      ...prevState,
      documento: ''
    }));
  }, [tipoCadastro]);

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerHeader}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <h2>Cadastro</h2>
      </div>
      <p className={styles.userTypePrompt}>Selecione seu tipo de usuário</p>
      <div className={styles.tabs}>
        <button
          className={tipoCadastro === 'pessoaComum' ? styles.activeTab : ''}
          onClick={() => setTipoCadastro('pessoaComum')}
        >
          Pessoa Comum
        </button>
        <button
          className={tipoCadastro === 'veterinaria' ? styles.activeTab : ''}
          onClick={() => setTipoCadastro('veterinaria')}
        >
          Veterinária
        </button>
        <button
          className={tipoCadastro === 'departamento' ? styles.activeTab : ''}
          onClick={() => setTipoCadastro('departamento')}
        >
          Departamento
        </button>
      </div>
      <form onSubmit={submeter} className={styles.registerForm}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={dadosCadastro.email}
            onChange={alterarDados}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="senha">Senha:</label>
          <input
            type="password"
            id="senha"
            name="senha"
            value={dadosCadastro.senha}
            onFocus={() => setShowPasswordTooltip(true)}
            onBlur={() => setShowPasswordTooltip(false)}
            onChange={alterarDados}
            required
          />
          {showPasswordTooltip && (
            <div className={styles.passwordTooltip}>
              <p>A senha deve ter:</p>
              <ul>
                <li>Mínimo de 8 caracteres:</li>
                <li>Letra maiúscula</li>
                <li>Letra minúscula</li>
                <li>Número</li>
                <li>Caractere especial</li>
              </ul>
            </div>
          )}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="confirmacaoSenha">Confirmação da senha:</label>
          <input
            type="password"
            id="confirmacaoSenha"
            name="confirmacaoSenha"
            value={confirmacaoSenha}
            onChange={(event) => setConfirmacaoSenha(event.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="nome">Nome do usuário:</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={dadosCadastro.nome}
            onChange={alterarDados}
            required
          />
        </div>
        {tipoCadastro === 'pessoaComum' && (
          <div className={styles.formGroup}>
            <label htmlFor="cpf">CPF:</label>
            <input
              type="text"
              id="documento"
              name="documento"
              value={dadosCadastro.documento}
              onChange={alterarDados}
              required
            />
          </div>
        )}
        {tipoCadastro === 'veterinaria' && (
          <div className={styles.formGroup}>
            <label htmlFor="documento">Número do Registro de Medicina Veterinária:</label>
            <input
              type="text"
              id="documento"
              name="documento"
              value={dadosCadastro.documento}
              onChange={alterarDados}
              required
            />
          </div>
        )}
        {tipoCadastro === 'departamento' && (
          <div className={styles.formGroup}>
            <label htmlFor="cnpj">CNPJ:</label>
            <input
              type="text"
              id="documento"
              name="documento"
              value={dadosCadastro.documento}
              onChange={alterarDados}
              required
            />
          </div>
        )}
        <div className={styles.formGroup}>
          <label htmlFor="telefone">Número do telefone com DDD:</label>
          <input
            type="text"
            id="telefone"
            name="telefone"
            value={dadosCadastro.telefone}
            onChange={alterarDados}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>Cadastre-se</button>
      </form>
      <p className={styles.backToLogin}>
        Já tem uma conta? <Link to="/login">Voltar para o login</Link>
      </p>
    </div>
  );
};

export default Register;
