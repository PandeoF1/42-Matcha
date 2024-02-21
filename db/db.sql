--
-- PostgreSQL database dump
--

-- Dumped from database version 14.10 (Ubuntu 14.10-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.10

-- Started on 2024-02-21 13:44:29 UTC

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 214 (class 1259 OID 27223)
-- Name: chat; Type: TABLE; Schema: public; Owner: matchadmin
--

CREATE TABLE public.chat (
    id uuid NOT NULL,
    user_1 uuid NOT NULL,
    user_2 uuid NOT NULL
);


ALTER TABLE public.chat OWNER TO matchadmin;

--
-- TOC entry 209 (class 1259 OID 16446)
-- Name: email_validation; Type: TABLE; Schema: public; Owner: matchadmin
--

CREATE TABLE public.email_validation (
    id character varying NOT NULL,
    creation_date date NOT NULL,
    user_id uuid NOT NULL,
    type character varying NOT NULL,
    value character varying
);


ALTER TABLE public.email_validation OWNER TO matchadmin;

--
-- TOC entry 213 (class 1259 OID 16593)
-- Name: images; Type: TABLE; Schema: public; Owner: matchadmin
--

CREATE TABLE public.images (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    image bit varying NOT NULL
);


ALTER TABLE public.images OWNER TO matchadmin;

--
-- TOC entry 212 (class 1259 OID 16580)
-- Name: interactions; Type: TABLE; Schema: public; Owner: matchadmin
--

CREATE TABLE public.interactions (
    id uuid NOT NULL,
    origin uuid NOT NULL,
    recipient uuid NOT NULL,
    type character varying NOT NULL,
    date bigint NOT NULL
);


ALTER TABLE public.interactions OWNER TO matchadmin;

--
-- TOC entry 215 (class 1259 OID 27228)
-- Name: messages; Type: TABLE; Schema: public; Owner: matchadmin
--

CREATE TABLE public.messages (
    id uuid NOT NULL,
    content character varying NOT NULL,
    date character varying NOT NULL,
    user_id uuid NOT NULL,
    chat_id uuid NOT NULL
);


ALTER TABLE public.messages OWNER TO matchadmin;

--
-- TOC entry 210 (class 1259 OID 16451)
-- Name: token; Type: TABLE; Schema: public; Owner: matchadmin
--

CREATE TABLE public.token (
    id uuid NOT NULL,
    token character varying NOT NULL,
    user_id uuid NOT NULL,
    creation_date bigint,
    last_activity bigint
);


ALTER TABLE public.token OWNER TO matchadmin;

--
-- TOC entry 211 (class 1259 OID 16456)
-- Name: users; Type: TABLE; Schema: public; Owner: matchadmin
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    first_name character varying(20) NOT NULL,
    last_name character varying(20) NOT NULL,
    password character varying NOT NULL,
    images character varying[],
    status boolean,
    completion smallint DEFAULT 0 NOT NULL,
    gender character varying DEFAULT 'male'::character varying,
    orientation character varying DEFAULT 'bisexual'::character varying,
    elo double precision DEFAULT 1,
    bio character varying,
    geoloc character varying DEFAULT '0,0'::character varying,
    email character varying NOT NULL,
    username character varying(16) NOT NULL,
    age integer DEFAULT 18,
    tags json DEFAULT '{}'::json,
    last_activity bigint
);


ALTER TABLE public.users OWNER TO matchadmin;

--
-- TOC entry 3248 (class 2606 OID 27227)
-- Name: chat chat_pkey; Type: CONSTRAINT; Schema: public; Owner: matchadmin
--

ALTER TABLE ONLY public.chat
    ADD CONSTRAINT chat_pkey PRIMARY KEY (id);


--
-- TOC entry 3238 (class 2606 OID 16464)
-- Name: email_validation email_validation_pkey; Type: CONSTRAINT; Schema: public; Owner: matchadmin
--

ALTER TABLE ONLY public.email_validation
    ADD CONSTRAINT email_validation_pkey PRIMARY KEY (id);


--
-- TOC entry 3246 (class 2606 OID 16597)
-- Name: images images_pkey; Type: CONSTRAINT; Schema: public; Owner: matchadmin
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_pkey PRIMARY KEY (id);


--
-- TOC entry 3244 (class 2606 OID 16586)
-- Name: interactions interactions_pkey; Type: CONSTRAINT; Schema: public; Owner: matchadmin
--

ALTER TABLE ONLY public.interactions
    ADD CONSTRAINT interactions_pkey PRIMARY KEY (id);


--
-- TOC entry 3250 (class 2606 OID 27234)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: matchadmin
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- TOC entry 3240 (class 2606 OID 16466)
-- Name: token token_pkey; Type: CONSTRAINT; Schema: public; Owner: matchadmin
--

ALTER TABLE ONLY public.token
    ADD CONSTRAINT token_pkey PRIMARY KEY (id);


--
-- TOC entry 3242 (class 2606 OID 16468)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: matchadmin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


-- Completed on 2024-02-21 13:44:29 UTC

--
-- PostgreSQL database dump complete
--
