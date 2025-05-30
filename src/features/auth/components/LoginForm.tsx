'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@features/auth/api/authService';
import { useAuth } from '@features/auth/context';
import Link from 'next/link';
import { FaChild, FaExclamationTriangle } from 'react-icons/fa';
import styles from '@app/login/login.module.css';  // Fixed import path

export default function LoginForm() {
  // ... rest of the component remains the same ...
}
