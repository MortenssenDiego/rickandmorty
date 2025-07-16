import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { useToast } from '../useToast';

describe('useToast', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useToast());

    expect(result.current.toast).toEqual({
      message: '',
      type: 'info',
      visible: false,
    });
  });

  it('should show toast with default type', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast('Test message');
    });

    expect(result.current.toast).toEqual({
      message: 'Test message',
      type: 'info',
      visible: true,
    });
  });

  it('should show toast with specified type', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast('Test message', 'error');
    });

    expect(result.current.toast).toEqual({
      message: 'Test message',
      type: 'error',
      visible: true,
    });
  });

  it('should hide toast', () => {
    const { result } = renderHook(() => useToast());

    // Primero mostrar el toast
    act(() => {
      result.current.showToast('Test message');
    });

    expect(result.current.toast.visible).toBe(true);

    // Luego ocultarlo
    act(() => {
      result.current.hideToast();
    });

    expect(result.current.toast.visible).toBe(false);
  });

  it('should show error toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showError('Error message');
    });

    expect(result.current.toast).toEqual({
      message: 'Error message',
      type: 'error',
      visible: true,
    });
  });

  it('should show success toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showSuccess('Success message');
    });

    expect(result.current.toast).toEqual({
      message: 'Success message',
      type: 'success',
      visible: true,
    });
  });

  it('should show warning toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showWarning('Warning message');
    });

    expect(result.current.toast).toEqual({
      message: 'Warning message',
      type: 'warning',
      visible: true,
    });
  });

  it('should show info toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showInfo('Info message');
    });

    expect(result.current.toast).toEqual({
      message: 'Info message',
      type: 'info',
      visible: true,
    });
  });

  it('should maintain message when hiding toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast('Test message', 'success');
    });

    act(() => {
      result.current.hideToast();
    });

    expect(result.current.toast.message).toBe('Test message');
    expect(result.current.toast.type).toBe('success');
    expect(result.current.toast.visible).toBe(false);
  });
}); 