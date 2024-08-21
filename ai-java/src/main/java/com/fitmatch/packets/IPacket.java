package com.fitmatch.packets;

import com.fitmatch.core.Fitmatch;

public interface IPacket {

    default String toJson() {
        return Fitmatch.getInstance().getGson().toJson(this, this.getClass());
    }
}
