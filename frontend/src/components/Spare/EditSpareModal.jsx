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
    const isUser = role === "user";
    const isAdmin = role === "admin";
    const inputClass = "border rounded-xl p-3 w-full";

    const readOnlyClass = "bg-gray-100 text-gray-500 cursor-not-allowed";
    
    const editableClass = "bg-amber-50 border-amber-400 ring-1 ring-amber-300 focus:ring-2 focus:ring-amber-500";

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

                        disabled={isUser}

                        onChange={(e)=>

                            setForm({

                                ...form,

                                name:e.target.value

                            })

                        }

                        className={`${inputClass} ${isUser ? readOnlyClass : ""}`}

                    />

                    <input

                        placeholder="Mã ID"

                        value={form.deviceId}

                        disabled={isUser}

                        onChange={(e)=>

                            setForm({

                                ...form,

                                deviceId:e.target.value

                            })

                        }

                        className={`${inputClass} ${isUser ? readOnlyClass : ""}`}

                    />

                    <input

                        placeholder="Ký hiệu"

                        value={form.symbol}

                        disabled={isUser}

                        onChange={(e)=>

                            setForm({

                                ...form,

                                symbol:e.target.value

                            })

                        }

                        className={`${inputClass} ${isUser ? readOnlyClass : ""}`}

                    />

                    <select

                        value={form.condition}

                        disabled={isUser}

                        onChange={(e)=>

                            setForm({

                                ...form,

                                condition:e.target.value

                            })

                        }

                        className={`${inputClass} ${isUser ? readOnlyClass : ""}`}

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

                        disabled={isUser}

                        onChange={(e)=>

                            setForm({

                                ...form,

                                warehouse:e.target.value

                            })

                        }

                        className={`${inputClass} ${isUser ? readOnlyClass : ""}`}

                    />

                    <input

                        placeholder="Tủ"

                        value={form.cabinet}

                        disabled={isUser}

                        onChange={(e)=>

                            setForm({

                                ...form,

                                cabinet:e.target.value

                            })

                        }

                        className={`${inputClass} ${isUser ? readOnlyClass : ""}`}

                    />

                    <input

                        placeholder="Kệ"

                        value={form.shelf}

                        disabled={isUser}

                        onChange={(e)=>

                            setForm({

                                ...form,

                                shelf:e.target.value

                            })

                        }

                        className={`${inputClass} ${isUser ? readOnlyClass : ""}`}

                    />

                    <input

                        placeholder="Khay"

                        value={form.slot}

                        disabled={isUser}

                        onChange={(e)=>

                            setForm({

                                ...form,

                                slot:e.target.value

                            })

                        }

                        className={`${inputClass} ${isUser ? readOnlyClass : ""}`}

                    />

                    {/* =========================
                        SỐ LƯỢNG
                    ========================= */}
                    
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-3">
                    
                        {/* BAN ĐẦU */}
                        <div>
                    
                            <label
                                className="
                                    block
                                    mb-2
                                    text-sm
                                    font-semibold
                                    text-slate-600
                                "
                            >
                                Ban đầu
                            </label>
                    
                            <input
                                type="number"
                                min="0"
                                value={form.initialQuantity ?? 0}
                                disabled={editing || isUser}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        initialQuantity:
                                            Number(e.target.value) || 0
                                    })
                                }
                                className={`
                                    ${inputClass}
                                    ${isUser ? readOnlyClass : ""}
                                `}
                            />
                    
                        </div>
                    
                    
                        {/* NHẬP */}
                        <div>
                    
                            <label
                                className="
                                    block
                                    mb-2
                                    text-sm
                                    font-semibold
                                    text-slate-600
                                "
                            >
                                Nhập
                            </label>
                    
                            <input
                                type="number"
                                min="0"
                                value={form.importQty ?? 0}
                                disabled={isUser}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        importQty:
                                            Number(e.target.value) || 0
                                    })
                                }
                                className={`
                                    ${inputClass}
                                    ${isUser ? readOnlyClass : ""}
                                `}
                            />
                    
                        </div>
                    
                    
                        {/* XUẤT */}
                        <div>
                    
                            <label
                                className="
                                    block
                                    mb-2
                                    text-sm
                                    font-semibold
                                    text-slate-600
                                "
                            >
                                Xuất
                            </label>
                    
                            <input
                                type="number"
                                min="0"
                                value={form.exportQty ?? 0}
                                disabled={!editing}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        exportQty:
                                            Number(e.target.value) || 0
                                    })
                                }
                                className={`
                                    ${inputClass}
                                    ${isUser ? editableClass : ""}
                                `}
                            />
                    
                        </div>
                    
                    </div>
                    
                    <input

                        placeholder="Đơn vị"

                        value={form.unit}

                        disabled={isUser}

                        onChange={(e)=>

                            setForm({

                                ...form,

                                unit:e.target.value

                            })

                        }

                        className={`${inputClass} ${isUser ? readOnlyClass : ""}`}

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

                        className={`
                            ${inputClass}
                            ${isUser ? editableClass : ""}
                        `}

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

                        className={`
                            border
                            rounded-xl
                            p-3
                            md:col-span-2
                            ${isUser ? editableClass : ""}
                        `}

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
