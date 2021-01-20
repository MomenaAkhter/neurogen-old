var box2d = {
	b2Vec2: Box2D.Common.Math.b2Vec2,
	b2BodyDef: Box2D.Dynamics.b2BodyDef,
	b2Body: Box2D.Dynamics.b2Body,
	b2FixtureDef: Box2D.Dynamics.b2FixtureDef,
	b2Fixture: Box2D.Dynamics.b2Fixture,
	b2World: Box2D.Dynamics.b2World,
	b2MassData: Box2D.Collision.Shapes.b2MassData,
	b2PolygonShape: Box2D.Collision.Shapes.b2PolygonShape,
	b2CircleShape: Box2D.Collision.Shapes.b2CircleShape,
	b2RevoluteJointDef: Box2D.Dynamics.Joints.b2RevoluteJointDef,
	b2DebugDraw: Box2D.Dynamics.b2DebugDraw,
	b2Contact: Box2D.Dynamics.Contacts,
	b2ContactListener: Box2D.Dynamics.b2ContactListener
};

var Vec2 = box2d.b2Vec2;

var SCALE = 100;