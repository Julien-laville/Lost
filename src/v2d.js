function v2d(x,y) {
    this.x = x
    this.y = y
    this.tmp = 1;//for buff & swap
}
    
    v2d.prototype.setPoint = function(x,y) {
        this.x = x
        this.y = y
    }
    v2d.prototype.clone = function() {
        return new v2d(this.x,this.y)
    }
    v2d.prototype.invert = function() {
        this.x = -this.x
        this.y = -this.y
        return this
    }
    v2d.prototype.maxLength = function(max) {
        this.tmp = this.norm()
        if(this.tmp > max) {
            this.scale(max/this.tmp)
        }
        return this
    }
    
    v2d.prototype.setVector = function(v) {
        this.x = v.x
        this.y = v.y
        return this
    }
    v2d.prototype.cmp = function(v) {
        return this.norm() > v.norm()
    }
    v2d.prototype.X = function(o){
        this.x=this.x*o.x;
        this.y=this.y*o.y;
        return this
    }
    v2d.prototype.normalize = function() {
        this.tmp = this.x;
        this.x  = this.x / Math.hypot(this.x,this.y)
        this.y = this.y / Math.hypot(this.tmp,this.y)
        return this
    }
    v2d.prototype.addP = function(x,y) {
        this.x=this.x+x
        this.y=this.y+y
        return this
    }
    v2d.prototype.add = function(o){
        this.x=this.x+o.x
        this.y=this.y+o.y
        return this
    }
    v2d.prototype.sub = function(o){
        this.x=this.x-o.x
        this.y=this.y-o.y
        return this
    }
    v2d.prototype.scale = function(n){
        this.x=this.x*n;this.y=this.y*n;
        return this
    }
    v2d.prototype.toString = function() {
        return `${this.x.toFixed(2)}|${this.y.toFixed(2)}`
    }
    v2d.prototype.stance = function(o) {
        return Math.sqrt(
            (this.y-o.y)*(this.y-o.y)+  
            (this.x-o.x)*(this.x-o.x)
        )
    }
    v2d.prototype.norm = function() {
        return Math.hypot(this.x,this.y)
    }