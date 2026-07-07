export default function EditSpareModal({

    show,

    editing,

    form,

    setForm,

    role,

    defaultForm,

    onClose,

    onSave

}) {

    if (!show) return null;

    return (

        <div
            className="
                fixed
                inset-0
                bg-black/40
                z-50
                flex
                items-center
                justify-center
                p-4
            "
        >

            <div
                className="
                    bg-white
                    rounded-3xl
                    p-5
                    w-full
                    max-w-4xl
                    shadow-2xl
                    max-h-[90vh]
                    overflow-y-auto
                "
            >

                <h2
                    className="
                        text-2xl
                        font-bold
                        mb-6
                    "
                >

                    {editing

                        ? "✏️ Chỉnh sửa thiết bị"

                        : "➕ Thêm thiết bị dự phòng"

                    }

                </h2>

                <div
                    className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        gap-3
                    "
                >

                    <input

                        placeholder="Tên thiết bị"

                        value={form.name}

                        disabled={role==="user"}

                        onChange={(e)=>

                            setForm({

                                ...form,

                                name:e.target.value

                            })

                        }

                        className="border rounded-xl p-3"

                    />

                    <input

                        placeholder="Mã ID"

                        value={form.deviceId}

                        disabled={role==="user"}

                        onChange={(e)=>

                            setForm({

                                ...form,

                                deviceId:e.target.value

                            })

                        }

                        className="border rounded-xl p-3"

                    />

                    <input

                        placeholder="Ký hiệu"

                        value={form.symbol}

                        disabled={role==="user"}

                        onChange={(e)=>

                            setForm({

                                ...form,

                                symbol:e.target.value

                            })

                        }

                        className="border rounded-xl p-3"

                    />

                    <select

                        value={form.condition}

                        disabled={role==="user"}

                        onChange={(e)=>

                            setForm({

                                ...form,

                                condition:e.target.value

                            })

                        }

                        className="border rounded-xl p-3"

                    >

                        <option value="New">

                            Thiết bị mới

                        </option>

                        <option value="Used">

                            Đã sử dụng

                        </option>

                        <option value="Broken">

                            Hỏng

                        </option>

                    </select>

                    <input

                        placeholder="Kho"

                        value={form.warehouse}

                        onChange={(e)=>

                            setForm({

                                ...form,

                                warehouse:e.target.value

                            })

                        }

                        className="border rounded-xl p-3"

                    />

                    <input

                        placeholder="Tủ"

                        value={form.cabinet}

                        onChange={(e)=>

                            setForm({

                                ...form,

                                cabinet:e.target.value

                            })

                        }

                        className="border rounded-xl p-3"

                    />

                    <input

                        placeholder="Kệ"

                        value={form.shelf}

                        onChange={(e)=>

                            setForm({

                                ...form,

                                shelf:e.target.value

                            })

                        }

                        className="border rounded-xl p-3"

                    />

                    <input

                        placeholder="Khay"

                        value={form.slot}

                        onChange={(e)=>

                            setForm({

                                ...form,

                                slot:e.target.value

                            })

                        }

                        className="border rounded-xl p-3"

                    />

                    <input

                        type="number"

                        placeholder="Ban đầu"

                        value={form.initialQuantity}

                        disabled={editing}

                        onChange={(e)=>

                            setForm({

                                ...form,

                                initialQuantity:Number(e.target.value)

                            })

                        }

                        className="border rounded-xl p-3"

                    />

                    <input

                        type="number"

                        placeholder="Nhập"

                        value={form.importQty}

                        onChange={(e)=>

                            setForm({

                                ...form,

                                importQty:Number(e.target.value)

                            })

                        }

                        className="border rounded-xl p-3"

                    />

                    <input

                        type="number"

                        placeholder="Xuất"

                        value={form.exportQty}

                        disabled={!editing}

                        onChange={(e)=>

                            setForm({

                                ...form,

                                exportQty:Number(e.target.value)

                            })

                        }

                        className="border rounded-xl p-3"

                    />

                    <input

                        placeholder="Đơn vị"

                        value={form.unit}

                        onChange={(e)=>

                            setForm({

                                ...form,

                                unit:e.target.value

                            })

                        }

                        className="border rounded-xl p-3"

                    />

                    <input

                        placeholder="Người chỉnh sửa"

                        value={form.editedBy}

                        onChange={(e)=>

                            setForm({

                                ...form,

                                editedBy:e.target.value

                            })

                        }

                        className="border rounded-xl p-3"

                    />

                    <textarea

                        rows={3}

                        placeholder="Ghi chú"

                        value={form.note}

                        onChange={(e)=>

                            setForm({

                                ...form,

                                note:e.target.value

                            })

                        }

                        className="
                            border
                            rounded-xl
                            p-3
                            md:col-span-2
                        "

                    />

                </div>

                <div
                    className="
                        flex
                        justify-end
                        gap-3
                        mt-6
                    "
                >

                    <button

                        onClick={()=>{

                            onClose();

                        }}

                        className="
                            px-5
                            py-3
                            rounded-xl
                            bg-gray-200
                        "

                    >

                        Hủy

                    </button>

                    <button

                        onClick={onSave}

                        className="
                            px-5
                            py-3
                            rounded-xl
                            bg-blue-600
                            text-white
                        "

                    >

                        {editing

                            ? "Cập nhật"

                            : "Lưu"

                        }

                    </button>

                </div>

            </div>

        </div>

    );

}
