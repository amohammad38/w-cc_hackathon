package com.example.controllers

import org.springframework.web.bind.annotation.*

data class Store(val name: String, val price: Double, val lat: Double, val lng: Double)

@RestController
@RequestMapping("/api/locations")
class LocationController {

    @GetMapping
    fun getLocations(@RequestParam product: String): List<Store> {
        return listOf(
            Store("CVS Pharmacy", 19.99, 37.7749, -122.4194),
            Store("Walgreens", 22.50, 37.7755, -122.4205),
            Store("Planned Parenthood", 0.00, 37.7761, -122.4211)
        )
    }
}
