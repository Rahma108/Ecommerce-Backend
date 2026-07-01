import { Module } from "@nestjs/common";
import { RealtimeGateway } from "./realtime.gateway";
import { CacheService , TokenService } from "src/common/utils";




@Module({
    providers :[ RealtimeGateway , TokenService , CacheService]

})
export class RealtimeModule {

}