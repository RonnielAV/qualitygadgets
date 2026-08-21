import { NextResponse } from 'next/server';
import { getAllOrders, updateOrderStatus, deleteOrder } from '@/lib/orders-store';

export async function GET() {
  try {
    const orders = await getAllOrders();
    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { orderId, status } = await request.json();
    if (!orderId || !status) {
      return NextResponse.json({ success: false, message: 'orderId y status requeridos' }, { status: 400 });
    }
    const updated = await updateOrderStatus(orderId, status);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Orden no encontrada' }, { status: 404 });
    }
    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json({ success: false, message: 'orderId requerido' }, { status: 400 });
    }

    const deleted = await deleteOrder(orderId);
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Orden no encontrada o ya eliminada' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Orden eliminada exitosamente' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
